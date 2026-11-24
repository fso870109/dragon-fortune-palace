/* 龍運金殿 v28.160 雲端存檔：已登入 Google（非匿名）的帳號，虛擬籌碼與遊戲進度存到 Firestore saves/{uid}，
   只有本人可讀寫。訪客（匿名）只存本機，不寫雲端。純虛擬・無兌現，籌碼沒有任何現金價值。
   流程：每次載入／回到前景先讀雲端（pull），完成前不上傳（防止冷啟動的 1,000 蓋掉雲端）；
   本機白名單鍵改變時（store.js 攔截）節流 1.5 秒（最長 8 秒）上傳；離開頁面、切到背景時立即上傳。
   合併：新裝置／剛切換帳號／本機為全新預設 → 採用雲端；從未同步過但本機有進度（舊版升級）→ 合併取高；
   同一帳號雲端版本較新 → 本機無未上傳變更時採用雲端，有未上傳變更時合併取高。寫入用交易，版本號 rev 逐次加一。 */
(function () {
const L = window.DFPcsLocal;
if (!L) return;
const V = '13.2.0', G = 'https://www.gstatic.com/firebasejs/' + V + '/';
const CFG = {
  apiKey: 'AIzaSyCffzfcOJ_BgFJ9ClB-krTZVLF44lEfZuo',
  authDomain: 'dragon-gold-palace.firebaseapp.com',
  projectId: 'dragon-gold-palace',
  storageBucket: 'dragon-gold-palace.firebasestorage.app',
  messagingSenderId: '145905961748',
  appId: '1:145905961748:web:59d23670251d01f9795001'
};
const DEBOUNCE = 1500, MAXWAIT = 8000;
const st = { on: false, ready: false, uid: '', last: 0, err: '', stopped: false, busy: false };
let F = null, auth = null, db = null, chain = Promise.resolve(), timer = 0, firstDirty = 0, lastPull = 0;

function isNative() {
  try {
    if (window.Capacitor && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform()) return true;
    if (window.Capacitor && window.Capacitor.isNative === true) return true;
  } catch (e) {}
  return false;
}
function useEmulator() {
  try {
    const q = new URLSearchParams(location.search).get('fbemu');
    if (q === '0' || q === '1') return q === '1';
    const s = sessionStorage.getItem('dfp_fbemu');
    if (s === '0' || s === '1') return s === '1';
  } catch (e) {}
  if (isNative()) return false;
  return location.hostname === '127.0.0.1' || location.hostname === 'localhost';
}
function code(e) { return String((e && (e.code || e.message)) || e || ''); }
function emit() { try { dispatchEvent(new CustomEvent('dfpcs', { detail: status() })); } catch (e) {} }
function status() { return { on: st.on, ready: st.ready, last: st.last, err: st.err, uid: st.uid }; }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function statusText() {
  if (!st.on) return '雲端同步：登入 Google 後開啟（訪客進度只存在本裝置）';
  if (st.ready && st.last) {
    const d = new Date(st.last);
    return '雲端同步：已開啟・上次同步 ' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  if (st.ready) return '雲端同步：已開啟';
  return '雲端同步：已開啟・連線後自動同步';
}

async function load() {
  if (F) return F;
  const [app, au, fs] = await Promise.all([
    import(G + 'firebase-app.js'), import(G + 'firebase-auth.js'), import(G + 'firebase-firestore.js')
  ]);
  F = { app, au, fs };
  return F;
}
async function handles() {
  await load();
  if (window.DFPfb && DFPfb._h) {
    try { await DFPfb.ready; } catch (e) {}
    const h = DFPfb._h();
    if (h && h.auth && h.db) return h;
    return null;
  }
  const emu = useEmulator();
  const app = F.app.getApps().length ? F.app.getApp() : F.app.initializeApp(CFG);
  const a = F.au.getAuth(app), d = F.fs.getFirestore(app, 'dragon');
  if (emu) {
    try { F.au.connectAuthEmulator(a, 'http://127.0.0.1:9099', { disableWarnings: true }); } catch (e) {}
    try { F.fs.connectFirestoreEmulator(d, '127.0.0.1', 8080); } catch (e) {}
  }
  try { await a.authStateReady(); } catch (e) {}
  return { auth: a, db: d };
}

/* ---------- 合併 ---------- */
function prim(x) { return x === null || typeof x !== 'object'; }
function deep(p, o) {
  if (Array.isArray(p) && Array.isArray(o)) {
    if (p.every(prim) && o.every(prim)) {
      if (p.length === o.length && p.length && p.every(function (x) { return typeof x === 'number'; }) && o.every(function (x) { return typeof x === 'number'; })) {
        return p.map(function (x, i) { return Math.max(x, o[i]); });
      }
      const out = p.slice();
      o.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
      return out;
    }
    return p;
  }
  if (p && o && typeof p === 'object' && typeof o === 'object' && !Array.isArray(p) && !Array.isArray(o)) {
    const out = {};
    Object.keys(p).forEach(function (k) { out[k] = (k in o) ? deep(p[k], o[k]) : p[k]; });
    Object.keys(o).forEach(function (k) { if (!(k in out)) out[k] = o[k]; });
    return out;
  }
  if (typeof p === 'number' && typeof o === 'number' && isFinite(p) && isFinite(o)) return Math.max(p, o);
  return p;
}
function parse(s) { try { return JSON.parse(s); } catch (e) { return undefined; } }
/* 合併取高：籌碼取較高者；其他鍵以籌碼較高的一方為主，數字取高、清單取聯集 */
function merge(a, b) {
  const primary = a.bal > b.bal ? a : b, other = primary === a ? b : a;
  const data = {};
  const keys = Object.keys(primary.data).concat(Object.keys(other.data).filter(function (k) { return !(k in primary.data); }));
  keys.forEach(function (k) {
    const pv = primary.data[k], ov = other.data[k];
    if (pv == null) { data[k] = ov; return; }
    if (ov == null || ov === pv) { data[k] = pv; return; }
    const P = parse(pv), O = parse(ov);
    if (P === undefined || O === undefined || prim(P) && prim(O) && typeof P !== 'number') { data[k] = pv; return; }
    try { data[k] = JSON.stringify(deep(P, O)); } catch (e) { data[k] = pv; }
    if (data[k].length > 32768) data[k] = pv;
  });
  return { bal: Math.max(a.bal, b.bal), data };
}
function same(a, b) {
  if (!a || !b || a.bal !== b.bal) return false;
  const ka = Object.keys(a.data).sort(), kb = Object.keys(b.data).sort();
  if (ka.length !== kb.length) return false;
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i] || a.data[ka[i]] !== b.data[kb[i]]) return false;
  return true;
}
function norm(d) {
  const data = {};
  const src = d && d.data && typeof d.data === 'object' ? d.data : {};
  Object.keys(src).forEach(function (k) { if (k !== 'fs_bal' && L.isKey(k) && typeof src[k] === 'string') data[k] = src[k]; });
  let bal = Math.floor(+(d && d.bal));
  if (!isFinite(bal) || bal < 0) bal = 0;
  return { rev: (d && d.rev) | 0, bal: Math.min(bal, 1e12), data };
}

/* ---------- 雲端讀寫 ---------- */
function conflict() { const e = new Error('rev-conflict'); e.code = 'rev-conflict'; return e; }
async function push(u, snap, baseRev, t0) {
  const ref = F.fs.doc(db, 'saves', u.uid);
  const rev = await F.fs.runTransaction(db, async function (tx) {
    const s = await tx.get(ref);
    const cur = s.exists() ? (s.data().rev | 0) : 0;
    if (cur !== baseRev) throw conflict();
    tx.set(ref, {
      v: 1, rev: cur + 1, bal: snap.bal, data: snap.data,
      updatedAt: F.fs.serverTimestamp(), clientAt: Date.now(), dev: isNative() ? 'app' : 'web'
    });
    return cur + 1;
  });
  L.setMeta({ uid: u.uid, rev: rev, at: Date.now() });
  L.clearDirty(t0);
  st.last = Date.now(); st.err = '';
  return rev;
}
function pageBusy() {
  try {
    /* eslint-disable no-undef */
    if (typeof spinning !== 'undefined' && spinning) return true;
    if (typeof FS !== 'undefined' && FS) return true;
    if (typeof bwState !== 'undefined' && bwState) return true;
    if (window.__hold) return true;
  } catch (e) {}
  return false;
}
function reloadGuard() {
  try {
    const now = Date.now();
    const r = JSON.parse(sessionStorage.getItem('dfp_cs_rl') || '[]').filter(function (t) { return now - t < 60000; });
    if (r.length >= 3) return false;
    r.push(now); sessionStorage.setItem('dfp_cs_rl', JSON.stringify(r));
  } catch (e) {}
  return true;
}
async function adoptSnap(u, snap, rev) {
  st.ready = false;
  for (let i = 0; i < 120 && pageBusy(); i++) await new Promise(function (r) { setTimeout(r, 500); });
  const P = { uid: u.uid, rev: rev, bal: snap.bal, data: snap.data };
  st.last = Date.now();
  if (reloadGuard()) { L.applyAndReload(P); return; }
  L.apply(P); st.ready = true; emit();
}
async function doSync(opt) {
  if (st.stopped || !auth || !db) return;
  const u = auth.currentUser;
  if (!u || u.isAnonymous || (window.DFPfb && DFPfb.deleting)) { st.on = false; st.ready = false; st.uid = ''; emit(); return; }
  if (st.uid !== u.uid) st.ready = false;
  st.uid = u.uid; st.on = true;
  if (opt.fresh) { try { await u.getIdToken(true); } catch (e) {} }
  lastPull = Date.now();
  const ref = F.fs.doc(db, 'saves', u.uid);
  const s = await F.fs.getDoc(ref);
  if (st.stopped || !auth.currentUser || auth.currentUser.uid !== u.uid) return;
  const cloud = s.exists() ? norm(s.data()) : null;
  const meta = L.meta();
  const t0 = Date.now();
  const dirty = L.dirty();
  const local = L.snapshot();
  const switched = !!opt.switched || !!(meta && meta.uid && meta.uid !== u.uid);
  const mine = !!(meta && meta.uid === u.uid);
  if (!cloud) {                                   /* 雲端還沒有存檔：上傳本機 */
    await push(u, local, 0, t0);
  } else if (switched || (!mine && L.isFresh())) { /* 新裝置／剛切換帳號／全新預設：採用雲端 */
    if (same(local, cloud)) { L.setMeta({ uid: u.uid, rev: cloud.rev, at: Date.now() }); L.clearDirty(t0); st.last = Date.now(); }
    else return adoptSnap(u, cloud, cloud.rev);
  } else if (!mine) {                             /* 舊版升級：本機有進度但沒同步過 → 合併取高 */
    const m = merge(local, cloud);
    if (same(m, cloud)) { L.setMeta({ uid: u.uid, rev: cloud.rev, at: Date.now() }); L.clearDirty(t0); st.last = Date.now(); }
    else {
      const rev = await push(u, m, cloud.rev, t0);
      if (!same(m, local)) return adoptSnap(u, m, rev);
    }
  } else {
    const base = meta.rev | 0;
    if (cloud.rev === base) {
      if (dirty) await push(u, local, cloud.rev, t0); else st.last = st.last || Date.now();
    } else if (cloud.rev > base) {               /* 另一部裝置玩過 */
      if (!dirty) {
        if (same(local, cloud)) { L.setMeta({ uid: u.uid, rev: cloud.rev, at: Date.now() }); st.last = Date.now(); }
        else return adoptSnap(u, cloud, cloud.rev);
      } else {
        const m = merge(local, cloud);
        const rev = await push(u, m, cloud.rev, t0);
        if (!same(m, local)) return adoptSnap(u, m, rev);
      }
    } else {
      await push(u, local, cloud.rev, t0);
    }
  }
  st.ready = true; st.err = ''; emit();
}
function run(fn) {
  chain = chain.then(fn).catch(function (e) {
    st.err = code(e); emit();
    if (st.err === 'rev-conflict') return doSync({}).catch(function (x) { st.err = code(x); emit(); });
  });
  return chain;
}
function sync(opt) { return run(function () { return doSync(opt || {}); }); }
function pushNow() {
  return run(async function () {
    if (!st.ready || st.stopped || !auth) return;
    const u = auth.currentUser;
    if (!u || u.isAnonymous || (window.DFPfb && DFPfb.deleting)) return;
    if (!L.dirty()) return;
    const meta = L.meta();
    if (!meta || meta.uid !== u.uid) return doSync({});
    const t0 = Date.now();
    await push(u, L.snapshot(), meta.rev | 0, t0);
    emit();
  });
}
function flush() { clearTimeout(timer); timer = 0; firstDirty = 0; return pushNow(); }
function schedule() {
  if (!st.ready || st.stopped) return;
  const now = Date.now();
  if (!firstDirty) firstDirty = now;
  clearTimeout(timer);
  timer = setTimeout(flush, Math.max(0, Math.min(DEBOUNCE, firstDirty + MAXWAIT - now)));
}

window.DFPcs = {
  status, statusText, sync, flush,
  stop: function () { st.stopped = true; st.ready = false; clearTimeout(timer); return chain.catch(function () {}); },
  _merge: merge
};
addEventListener('dfpcsdirty', schedule);
addEventListener('dfpcsflush', flush);
addEventListener('pagehide', function () { if (st.ready && L.dirty()) flush(); });
document.addEventListener('pause', function () { if (st.ready && L.dirty()) flush(); });
function fg() { if (st.on && !st.stopped && Date.now() - lastPull > 4000) sync({}); }
document.addEventListener('visibilitychange', function () {
  if (document.hidden) { if (st.ready && L.dirty()) flush(); } else fg();
});
document.addEventListener('resume', fg);
addEventListener('dfpcsauth', function (e) {
  st.stopped = false;
  sync({ switched: !!(e && e.detail && e.detail.switched), fresh: true });
});

try {
  if (sessionStorage.getItem('dfp_cs_msg') === 'restored') {
    sessionStorage.removeItem('dfp_cs_msg');
    setTimeout(function () { try { window.CZ && CZ.toast && CZ.toast('已從雲端還原進度', { title: '雲端同步', detail: '已從雲端還原進度' }); } catch (e) {} }, 1200);
  }
} catch (e) {}

(async function boot() {
  /* 非大廳頁面：這部裝置從未同步過 Google 帳號時不載入 Firebase（訪客不需要） */
  const lobby = !!(window.DFPfb && DFPfb._h);
  if (!lobby && !L.meta()) return;
  try {
    const h = await handles();
    if (!h) return;
    auth = h.auth; db = h.db;
    await sync({ switched: !!(window.DFPfb && DFPfb.bootSwitched), fresh: !!(window.DFPfb && DFPfb.bootSwitched) });
  } catch (e) { st.err = code(e); emit(); }
})();
})();
