/* 龍運金殿 v28.69: Firebase Auth＋Firestore（模組 SDK，不含 Analytics；含公會／排行榜） */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {
  getAuth, signInAnonymously, signOut, connectAuthEmulator
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc,
  deleteDoc, collection, getDocs, query, where, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js';

const CFG = {
  apiKey: 'AIzaSyCffzfcOJ_BgFJ9ClB-krTZVLF44lEfZuo',
  authDomain: 'dragon-gold-palace.firebaseapp.com',
  projectId: 'dragon-gold-palace',
  storageBucket: 'dragon-gold-palace.firebasestorage.app',
  messagingSenderId: '145905961748',
  appId: '1:145905961748:web:59d23670251d01f9795001'
};
const AVATARS = ['av_a', 'av_b', 'av_c', 'av_d', 'av_e'];
const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const AVQ = '?v=2850';
const GIFT = 50, BONUS = 100;

function useEmulator() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('fbemu') === '0') return false;
    if (q.get('fbemu') === '1') return true;
  } catch (e) {}
  return location.hostname === '127.0.0.1' || location.hostname === 'localhost';
}
function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function dayId() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
  } catch (e) {
    const d = new Date(Date.now() + 8 * 3600 * 1000);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
  }
}
function genCode() {
  const r = new Uint32Array(6);
  try { crypto.getRandomValues(r); } catch (e) { for (let i = 0; i < 6; i++) r[i] = Math.random() * 1e9; }
  let c = 'DF-';
  for (let i = 0; i < 6; i++) c += AL[r[i] % AL.length];
  return c;
}
function normCode(s) {
  s = String(s || '').toUpperCase().replace(/\s+/g, '');
  if (/^DF[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(s)) s = 'DF-' + s.slice(2);
  return s;
}
function isPerm(e) {
  const c = e && (e.code || e.message || '');
  return /permission-denied|PERMISSION_DENIED|Missing or insufficient permissions/i.test(String(c));
}
function faceHtml(av, name) {
  if (AVATARS.indexOf(av) >= 0) {
    return '<img src="assets/lx/' + av + '.webp' + AVQ + '" alt="">';
  }
  return String(name || '?').slice(0, 1);
}
function localName() {
  try {
    const st = JSON.parse(localStorage.getItem('fs_stats') || '{}');
    const n = (st && st.name ? String(st.name) : '').trim().slice(0, 12);
    if (n) return n;
  } catch (e) {}
  return '';
}
function pickAvatar(uid) {
  try {
    const saved = JSON.parse(localStorage.getItem('dfp_profile') || '{}');
    if (saved && AVATARS.indexOf(saved.avatar) >= 0) return saved.avatar;
  } catch (e) {}
  let h = 0;
  String(uid || '').split('').forEach((ch) => { h = (h + ch.charCodeAt(0)) % 5; });
  return AVATARS[h];
}
function cacheProfile(p) {
  try { localStorage.setItem('dfp_profile', JSON.stringify({
    displayName: p.displayName, avatar: p.avatar, friendCode: p.friendCode
  })); } catch (e) {}
}


function weekKey() {
  const day = dayId();
  const [y, m, d] = day.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const dow = new Date(utc).getUTCDay();
  const back = (dow + 6) % 7;
  const mon = new Date(utc - back * 86400000);
  return mon.getUTCFullYear() + '-' + pad2(mon.getUTCMonth() + 1) + '-' + pad2(mon.getUTCDate());
}
function genGuildCode() {
  const r = new Uint32Array(6);
  try { crypto.getRandomValues(r); } catch (e) { for (let i = 0; i < 6; i++) r[i] = Math.random() * 1e9; }
  let c = 'GD-';
  for (let i = 0; i < 6; i++) c += AL[r[i] % AL.length];
  return c;
}
function normGuildCode(s) {
  s = String(s || '').toUpperCase().replace(/\s+/g, '');
  if (/^GD[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(s)) s = 'GD-' + s.slice(2);
  return s;
}
function localSpins() {
  let a = 0, b = 0;
  try { a = (JSON.parse(localStorage.getItem('fs_stats') || '{}').spins) | 0; } catch (e) {}
  try { b = (window.CZ && CZ.st && CZ.st.spins) | 0; } catch (e) {}
  return Math.max(a, b, 0);
}

const api = {
  ready: null,
  live: false,
  guildsOk: false,
  emu: false,
  writesEnabled: false,
  user: null,
  profile: null,
  GIFT, BONUS, AVATARS, AVQ, dayId, weekKey, localSpins, faceHtml, normCode, normGuildCode
};
window.DFPfb = api;
window.DFPface = faceHtml;

let auth, db;

function guardWrite() {
  if (!api.writesEnabled || !api.live || !api.user) {
    throw new Error('fb-writes-blocked');
  }
}
function guardGuild() {
  guardWrite();
  if (!api.guildsOk) throw new Error('guilds-offline');
}

async function ensureProfile() {
  guardWrite();
  const uid = api.user.uid;
  const pref = doc(db, 'players', uid);
  const snap = await getDoc(pref);
  const level = Math.max(1, Math.min(999, (window.CZ && CZ.st && CZ.st.lv) | 0 || 1));
  if (snap.exists()) {
    const p = snap.data();
    api.profile = {
      uid,
      displayName: p.displayName,
      avatar: p.avatar,
      level: p.level || level,
      friendCode: p.friendCode,
      guildId: p.guildId || ''
    };
    if (p.level !== level) {
      try { await updateDoc(pref, { level, updatedAt: serverTimestamp() }); api.profile.level = level; } catch (e) {}
    }
    cacheProfile(api.profile);
    return api.profile;
  }
  const displayName = localName() || '旅人';
  const avatar = pickAvatar(uid);
  for (let i = 0; i < 8; i++) {
    const friendCode = genCode();
    try {
      await setDoc(doc(db, 'friendCodes', friendCode), { uid });
      await setDoc(pref, {
        displayName, avatar, level, friendCode,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
      api.profile = { uid, displayName, avatar, level, friendCode, guildId: '' };
      cacheProfile(api.profile);
      return api.profile;
    } catch (e) {
      if (isPerm(e) && i < 7) continue;
      throw e;
    }
  }
  throw new Error('friend-code-unavailable');
}

api.updateProfile = async function (patch) {
  guardWrite();
  await ensureProfile();
  const next = {
    displayName: api.profile.displayName,
    avatar: api.profile.avatar
  };
  if (patch && typeof patch.displayName === 'string') {
    const n = patch.displayName.trim().slice(0, 12);
    if (n) next.displayName = n;
  }
  if (patch && AVATARS.indexOf(patch.avatar) >= 0) next.avatar = patch.avatar;
  const level = Math.max(1, Math.min(999, (window.CZ && CZ.st && CZ.st.lv) | 0 || api.profile.level || 1));
  await updateDoc(doc(db, 'players', api.user.uid), {
    displayName: next.displayName,
    avatar: next.avatar,
    level,
    updatedAt: serverTimestamp()
  });
  api.profile.displayName = next.displayName;
  api.profile.avatar = next.avatar;
  api.profile.level = level;
  cacheProfile(api.profile);
  return api.profile;
};

async function drainInbox() {
  const uid = api.user.uid;
  const inbox = await getDocs(collection(db, 'players', uid, 'inbox'));
  for (const row of inbox.docs) {
    const from = row.id;
    const data = row.data() || {};
    let name = data.displayName, av = data.avatar, code = data.friendCode;
    try {
      const p = await getDoc(doc(db, 'players', from));
      if (p.exists()) {
        const d = p.data();
        name = d.displayName || name;
        av = d.avatar || av;
        code = d.friendCode || code;
      }
    } catch (e) {}
    if (AVATARS.indexOf(av) < 0) av = 'av_a';
    if (!name) name = '好友';
    try {
      await setDoc(doc(db, 'players', uid, 'friends', from), {
        displayName: String(name).slice(0, 12),
        avatar: av,
        friendCode: code || 'DF-XXXXXX',
        since: serverTimestamp()
      });
      await deleteDoc(doc(db, 'players', uid, 'inbox', from));
    } catch (e) {}
  }
}

api.listFriends = async function () {
  guardWrite();
  await drainInbox();
  const snap = await getDocs(collection(db, 'players', api.user.uid, 'friends'));
  const out = [];
  for (const row of snap.docs) {
    let item = {
      uid: row.id,
      displayName: row.data().displayName || '好友',
      avatar: row.data().avatar || 'av_a',
      friendCode: row.data().friendCode || '',
      level: 1
    };
    try {
      const p = await getDoc(doc(db, 'players', row.id));
      if (p.exists()) {
        const d = p.data();
        item.displayName = d.displayName || item.displayName;
        item.avatar = d.avatar || item.avatar;
        item.friendCode = d.friendCode || item.friendCode;
        item.level = d.level || 1;
      }
    } catch (e) {}
    out.push(item);
  }
  return out;
};

api.addFriend = async function (raw) {
  guardWrite();
  await ensureProfile();
  const code = normCode(raw);
  if (!/^DF-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(code)) {
    throw new Error('bad-code');
  }
  if (code === api.profile.friendCode) throw new Error('self');
  const look = await getDoc(doc(db, 'friendCodes', code));
  if (!look.exists()) throw new Error('not-found');
  const other = look.data().uid;
  if (!other || other === api.user.uid) throw new Error(other === api.user.uid ? 'self' : 'not-found');
  const pref = await getDoc(doc(db, 'players', other));
  if (!pref.exists()) throw new Error('not-found');
  const p = pref.data();
  const mine = await getDoc(doc(db, 'players', api.user.uid, 'friends', other));
  if (mine.exists()) throw new Error('already');
  await setDoc(doc(db, 'players', api.user.uid, 'friends', other), {
    displayName: p.displayName,
    avatar: p.avatar,
    friendCode: p.friendCode,
    since: serverTimestamp()
  });
  await setDoc(doc(db, 'players', other, 'inbox', api.user.uid), {
    displayName: api.profile.displayName,
    avatar: api.profile.avatar,
    friendCode: api.profile.friendCode,
    at: serverTimestamp()
  });
  return {
    uid: other,
    displayName: p.displayName,
    avatar: p.avatar,
    friendCode: p.friendCode,
    level: p.level || 1
  };
};

api.sendGift = async function (toUid) {
  guardWrite();
  const day = dayId();
  const id = api.user.uid + '_' + toUid + '_' + day;
  await setDoc(doc(db, 'gifts', id), {
    from: api.user.uid,
    to: toUid,
    day,
    createdAt: serverTimestamp()
  });
  return id;
};

api.listSent = async function () {
  guardWrite();
  const day = dayId();
  const q = query(collection(db, 'gifts'), where('from', '==', api.user.uid), where('day', '==', day));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

api.listReceived = async function () {
  guardWrite();
  const day = dayId();
  const q = query(collection(db, 'gifts'), where('to', '==', api.user.uid), where('day', '==', day));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};


api.getGuild = async function (gid) {
  guardGuild();
  await ensureProfile();
  gid = gid || api.profile.guildId;
  if (!gid) return null;
  const gs = await getDoc(doc(db, 'guilds', gid));
  if (!gs.exists()) return null;
  return { id: gs.id, ...gs.data() };
};

api.listMembers = async function (gid) {
  guardGuild();
  await ensureProfile();
  gid = gid || api.profile.guildId;
  if (!gid) return [];
  const snap = await getDocs(collection(db, 'guilds', gid, 'members'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
};

api.createGuild = async function (name) {
  guardGuild();
  await ensureProfile();
  if (api.profile.guildId) throw new Error('already-in');
  name = String(name || '').trim().slice(0, 12);
  if (!name) throw new Error('bad-name');
  let code = '';
  let last = null;
  for (let i = 0; i < 8; i++) {
    code = genGuildCode();
    try {
      await setDoc(doc(db, 'guilds', code), {
        name,
        code,
        leader: api.user.uid,
        memberCount: 1,
        createdAt: serverTimestamp()
      });
      last = null;
      break;
    } catch (e) {
      last = e;
    }
  }
  if (last) throw last;
  await setDoc(doc(db, 'guilds', code, 'members', api.user.uid), {
    displayName: api.profile.displayName,
    avatar: api.profile.avatar,
    joinedAt: serverTimestamp(),
    weekKey: weekKey(),
    weekSpins: 0,
    updatedAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'players', api.user.uid), {
    guildId: code,
    updatedAt: serverTimestamp()
  });
  api.profile.guildId = code;
  cacheProfile(api.profile);
  return { id: code, name, code, leader: api.user.uid, memberCount: 1 };
};

api.joinGuild = async function (raw) {
  guardGuild();
  await ensureProfile();
  if (api.profile.guildId) throw new Error('already-in');
  const gid = normGuildCode(raw);
  if (!/^GD-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(gid)) throw new Error('bad-code');
  const gref = doc(db, 'guilds', gid);
  const gs = await getDoc(gref);
  if (!gs.exists()) throw new Error('not-found');
  const g = gs.data();
  if ((g.memberCount | 0) >= 30) throw new Error('full');
  await setDoc(doc(db, 'guilds', gid, 'members', api.user.uid), {
    displayName: api.profile.displayName,
    avatar: api.profile.avatar,
    joinedAt: serverTimestamp(),
    weekKey: weekKey(),
    weekSpins: 0,
    updatedAt: serverTimestamp()
  });
  await updateDoc(gref, { memberCount: (g.memberCount | 0) + 1 });
  await updateDoc(doc(db, 'players', api.user.uid), {
    guildId: gid,
    updatedAt: serverTimestamp()
  });
  api.profile.guildId = gid;
  cacheProfile(api.profile);
  return { id: gid, ...g, memberCount: (g.memberCount | 0) + 1 };
};

api.leaveGuild = async function () {
  guardGuild();
  await ensureProfile();
  const gid = api.profile.guildId;
  if (!gid) throw new Error('no-guild');
  const gref = doc(db, 'guilds', gid);
  const gs = await getDoc(gref);
  const count = gs.exists() ? (gs.data().memberCount | 0) : 1;
  await deleteDoc(doc(db, 'guilds', gid, 'members', api.user.uid));
  if (gs.exists() && count > 0) {
    try { await updateDoc(gref, { memberCount: count - 1 }); } catch (e) {}
  }
  await updateDoc(doc(db, 'players', api.user.uid), {
    guildId: '',
    updatedAt: serverTimestamp()
  });
  api.profile.guildId = '';
  cacheProfile(api.profile);
};

function clampStat(n, lo, hi) {
  n = Number(n);
  if (!isFinite(n)) n = 0;
  return Math.max(lo, Math.min(hi, Math.floor(n)));
}

api.reportStats = async function (opt) {
  guardGuild();
  await ensureProfile();
  const wk = weekKey();
  const target = opt && opt.weekSpins != null
    ? clampStat(opt.weekSpins, 0, 10000)
    : null;
  let bestXr = opt && opt.bestXr != null ? Number(opt.bestXr) : 0;
  if (!isFinite(bestXr) || bestXr < 0) bestXr = 0;
  if (bestXr > 10000) bestXr = 10000;
  const p = api.profile;
  const brow = doc(db, 'playerBoard', wk, 'rows', api.user.uid);
  const bsnap = await getDoc(brow);
  let cur = 0, curBest = 0;
  if (bsnap.exists()) {
    cur = bsnap.data().weekSpins | 0;
    curBest = Number(bsnap.data().bestXr) || 0;
  }
  let next = cur;
  if (target != null) {
    if (!bsnap.exists() || cur === 0) next = Math.min(80, target);
    else next = Math.min(10000, Math.max(cur, Math.min(cur + 80, target)));
  }
  const row = {
    displayName: p.displayName,
    avatar: p.avatar,
    weekSpins: next,
    bestXr: Math.max(curBest, bestXr),
    updatedAt: serverTimestamp()
  };
  try {
    if (!bsnap.exists()) await setDoc(brow, row);
    else if (next !== cur || row.bestXr !== curBest || p.displayName !== bsnap.data().displayName || p.avatar !== bsnap.data().avatar) {
      await updateDoc(brow, row);
    }
  } catch (e) {
    if (bsnap.exists() && row.bestXr > curBest) {
      try { await updateDoc(brow, Object.assign({}, row, { weekSpins: cur })); } catch (x) {}
    }
  }
  const gid = p.guildId || '';
  if (/^GD-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(gid)) {
    const mref = doc(db, 'guilds', gid, 'members', api.user.uid);
    const ms = await getDoc(mref);
    if (ms.exists()) {
      const md = ms.data();
      const rolled = md.weekKey !== wk;
      const mcur = rolled ? 0 : (md.weekSpins | 0);
      let mnext = mcur;
      if (target != null) {
        if (rolled || mcur === 0) mnext = Math.min(80, target);
        else mnext = Math.min(10000, Math.max(mcur, Math.min(mcur + 80, target)));
      } else if (rolled) {
        mnext = 0;
      }
      try {
        await updateDoc(mref, {
          displayName: p.displayName,
          avatar: p.avatar,
          weekKey: wk,
          weekSpins: mnext,
          updatedAt: serverTimestamp()
        });
      } catch (e) {}
      try {
        const mems = await getDocs(collection(db, 'guilds', gid, 'members'));
        let sum = 0;
        mems.forEach((d) => {
          const x = d.data();
          if (x.weekKey === wk) sum += x.weekSpins | 0;
        });
        sum = Math.min(50000, sum);
        const grow = doc(db, 'guildBoard', wk, 'rows', gid);
        const gs = await getDoc(grow);
        let gname = p.displayName;
        try {
          const gdoc = await getDoc(doc(db, 'guilds', gid));
          if (gdoc.exists()) gname = gdoc.data().name || gname;
        } catch (e) {}
        if (!gs.exists()) {
          await setDoc(grow, {
            name: gname,
            spins: Math.min(80, sum),
            updatedAt: serverTimestamp()
          });
        } else {
          const gcur = gs.data().spins | 0;
          const gnext = Math.min(50000, Math.max(gcur, Math.min(gcur + 80, sum)));
          if (gnext !== gcur || gs.data().name !== gname) {
            await updateDoc(grow, { name: gname, spins: gnext, updatedAt: serverTimestamp() });
          }
        }
      } catch (e) {}
    }
  }
  return { weekSpins: next, bestXr: row.bestXr, weekKey: wk };
};

api.listGuildBoard = async function () {
  guardGuild();
  const snap = await getDocs(collection(db, 'guildBoard', weekKey(), 'rows'));
  return snap.docs.map((d) => ({ gid: d.id, ...d.data() }))
    .sort((a, b) => (b.spins | 0) - (a.spins | 0));
};

api.listPlayerBoard = async function () {
  guardGuild();
  const snap = await getDocs(collection(db, 'playerBoard', weekKey(), 'rows'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
    .sort((a, b) => (b.weekSpins | 0) - (a.weekSpins | 0) || (Number(b.bestXr) || 0) - (Number(a.bestXr) || 0));
};

window.DFPstat = window.DFPstat || {
  _best: 0,
  _t: 0,
  note: function (o) {
    try {
      if (o && o.xr != null) {
        const x = Number(o.xr);
        if (isFinite(x) && x > this._best) this._best = Math.min(10000, x);
      }
      if (window.DFPfb && DFPfb.guildsOk && typeof DFPfb.reportStats === 'function') {
        const now = Date.now();
        if (!this._t || now - this._t > 15000) {
          this._t = now;
          DFPfb.reportStats({ bestXr: this._best }).catch(function () {});
        }
      }
    } catch (e) {}
  }
};

async function probeAndInit() {
  const emu = useEmulator();
  api.emu = emu;
  const app = initializeApp(CFG);
  auth = getAuth(app);
  db = getFirestore(app);
  if (emu) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  let cred;
  try {
    cred = await signInAnonymously(auth);
  } catch (e) {
    api.live = false;
    api.writesEnabled = false;
    api.guildsOk = false;
    return false;
  }
  api.user = cred.user;
  try {
    await getDoc(doc(db, 'players', cred.user.uid));
  } catch (e) {
    api.live = false;
    api.writesEnabled = false;
    api.guildsOk = false;
    if (!emu) {
      try { await cred.user.delete(); } catch (x) {
        try { await signOut(auth); } catch (y) {}
      }
    }
    api.user = null;
    return false;
  }
  api.writesEnabled = true;
  api.live = true;
  try {
    await getDocs(collection(db, 'guildBoard', weekKey(), 'rows'));
    api.guildsOk = true;
  } catch (e) {
    api.guildsOk = false;
  }
  await ensureProfile();
  return true;
}

api.ready = probeAndInit().catch(function () {
  api.live = false;
  api.writesEnabled = false;
  api.guildsOk = false;
  return false;
});
