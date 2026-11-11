/* 龍運金殿 v28.83: Firebase Auth＋Firestore（模組 SDK，不含 Analytics；大頭貼與帳號連結；含公會／排行榜／掠奪／邀請） */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {
  getAuth, signInAnonymously, signOut, connectAuthEmulator,
  GoogleAuthProvider, FacebookAuthProvider,
  linkWithPopup, linkWithRedirect, getRedirectResult, linkWithCredential, signInWithCredential
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc,
  deleteDoc, collection, getDocs, query, where, serverTimestamp, writeBatch
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js';

const CFG = {
  apiKey: 'AIzaSyCffzfcOJ_BgFJ9ClB-krTZVLF44lEfZuo',
  authDomain: 'dragon-gold-palace.firebaseapp.com',
  projectId: 'dragon-gold-palace',
  storageBucket: 'dragon-gold-palace.firebasestorage.app',
  messagingSenderId: '145905961748',
  appId: '1:145905961748:web:59d23670251d01f9795001'
};
const FS_DB = 'dragon'; // named Firestore DB (asia-east1), not (default)
const AVATARS = ['av_a','av_b','av_c','av_d','av_e','av_f','av_g','av_h','av_i','av_j','av_k','av_l'];
const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const AVQ = '?v=2878';
const GIFT = 50, BONUS = 100, INVITE_REWARD = 5000, INVITE_DAILY_CAP = 5;

function isNativeApp() {
  try {
    if (window.Capacitor && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform()) return true;
    if (window.Capacitor && window.Capacitor.isNative === true) return true;
  } catch (e) {}
  return false;
}
function useEmulator() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('fbemu') === '0') return false;
    if (q.get('fbemu') === '1') return true;
  } catch (e) {}
  /* Capacitor WebView origin is https://localhost — that is NOT the Firebase emulator */
  if (isNativeApp()) return false;
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
function readPendingRef() {
  try {
    const q = new URLSearchParams(location.search);
    const code = normCode(q.get('ref') || '');
    if (/^DF-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(code)) {
      try { localStorage.setItem('dfp_ref', JSON.stringify({ code, t: Date.now() })); } catch (e) {}
      return code;
    }
  } catch (e) {}
  try {
    const s = JSON.parse(localStorage.getItem('dfp_ref') || '{}');
    const code = normCode(s && s.code);
    if (/^DF-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(code)) return code;
  } catch (e) {}
  return '';
}
function isPerm(e) {
  const c = e && (e.code || e.message || '');
  return /permission-denied|PERMISSION_DENIED|Missing or insufficient permissions/i.test(String(c));
}
function hostAllowed(h) {
  h = String(h || '').toLowerCase();
  return h === 'googleusercontent.com' || h.endsWith('.googleusercontent.com')
    || h === 'graph.facebook.com' || h.endsWith('.graph.facebook.com')
    || h === 'fbcdn.net' || h.endsWith('.fbcdn.net');
}
function isPhotoUrl(av) {
  if (typeof av !== 'string' || av.length < 20 || av.length > 500) return false;
  try {
    const u = new URL(av);
    return u.protocol === 'https:' && hostAllowed(u.hostname);
  } catch (e) { return false; }
}
function isBuiltIn(av) { return AVATARS.indexOf(av) >= 0; }
function isAvatar(av) { return isBuiltIn(av) || isPhotoUrl(av); }
function normAvatar(av, fallback) { return isAvatar(av) ? av : (fallback || 'av_a'); }
function escAttr(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '').replace(/>/g, '');
}
function builtInSrc(id) { return 'assets/lx/' + id + '.webp' + AVQ; }
function avatarSrc(av) { return isPhotoUrl(av) ? av : builtInSrc(isBuiltIn(av) ? av : 'av_a'); }
function faceHtml(av, name) {
  if (isPhotoUrl(av)) {
    return '<img src="' + escAttr(av) + '" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'' + builtInSrc('av_a') + '\'">';
  }
  if (isBuiltIn(av)) {
    return '<img src="' + builtInSrc(av) + '" alt="">';
  }
  return String(name || '?').slice(0, 1);
}
function enlargeFbPhoto(url, fbUid) {
  if (fbUid) {
    return 'https://graph.facebook.com/' + encodeURIComponent(fbUid) + '/picture?type=large&width=256&height=256';
  }
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname === 'graph.facebook.com' || u.hostname.endsWith('.graph.facebook.com')) {
      u.searchParams.set('type', 'large');
      u.searchParams.set('width', '256');
      u.searchParams.set('height', '256');
      const out = u.toString();
      return out.length <= 500 ? out : '';
    }
  } catch (e) {}
  return isPhotoUrl(url) ? url : '';
}
function photoFromProvider(p) {
  if (!p) return '';
  if (p.providerId === 'facebook.com') return enlargeFbPhoto(p.photoURL, p.uid);
  let u = p.photoURL || '';
  if (u && /googleusercontent\.com/i.test(u)) {
    const bigger = u.replace(/=s\d+(-[a-z])?/gi, '=s256$1');
    if (isPhotoUrl(bigger)) return bigger;
  }
  return isPhotoUrl(u) ? u : '';
}
function emitAv() {
  try { dispatchEvent(new CustomEvent('dfpav', { detail: { avatar: currentAvatar() } })); } catch (e) {}
}
function currentAvatar() {
  if (api.profile && isAvatar(api.profile.avatar)) return api.profile.avatar;
  try {
    const saved = JSON.parse(localStorage.getItem('dfp_profile') || '{}');
    if (saved && isAvatar(saved.avatar)) return saved.avatar;
  } catch (e) {}
  return 'av_a';
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
    if (saved && isAvatar(saved.avatar)) return saved.avatar;
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
  raidsOk: false,
  invitesOk: false,
  linkNotice: '',
  dbId: 'dragon',
  emu: false,
  writesEnabled: false,
  user: null,
  profile: null,
  GIFT, BONUS, INVITE_REWARD, INVITE_DAILY_CAP, AVATARS, AVQ, dayId, weekKey, localSpins, faceHtml, normCode, normGuildCode, isAvatar, avatarSrc, currentAvatar
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
function guardRaid() {
  guardWrite();
  if (!api.raidsOk) throw new Error('raids-offline');
}
function guardInvite() {
  guardWrite();
  if (!api.invitesOk) throw new Error('invites-offline');
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
      guildId: p.guildId || '',
      pendingRef: p.pendingRef || ''
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
      const pendingRef = readPendingRef();
      const row = {
        displayName, avatar, level, friendCode,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      };
      if (pendingRef && pendingRef !== friendCode) row.pendingRef = pendingRef;
      try {
        await setDoc(pref, row);
      } catch (e) {
        if (isPerm(e) && row.avatar !== 'av_a') {
          row.avatar = 'av_a';
          await setDoc(pref, row);
        } else {
          throw e;
        }
      }
      api.profile = { uid, displayName, avatar: row.avatar, level, friendCode, guildId: '', pendingRef: row.pendingRef || '' };
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
  if (patch && isAvatar(patch.avatar)) next.avatar = patch.avatar;
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
  emitAv();
  if (api.guildsOk) {
    api.reportStats({}).catch(function () {});
  }
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
    av = normAvatar(av);
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
  try { await maybeWriteInvite(other, code); } catch (e) {}
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


function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

api.heartbeat = async function () {
  guardRaid();
  await ensureProfile();
  const day = dayId();
  const ref = doc(db, 'active', day, 'rows', api.user.uid);
  const payload = {
    displayName: api.profile.displayName,
    avatar: api.profile.avatar,
    updatedAt: serverTimestamp()
  };
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) await updateDoc(ref, payload);
    else await setDoc(ref, payload);
  } catch (e) {}
};

api.listActive = async function () {
  guardRaid();
  const snap = await getDocs(collection(db, 'active', dayId(), 'rows'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
    .filter((p) => p.uid !== api.user.uid);
};

api.listRaidTargets = async function () {
  guardRaid();
  await ensureProfile();
  await api.heartbeat();
  const me = api.user.uid;
  const map = new Map();
  const add = function (p) {
    if (!p || !p.uid || p.uid === me) return;
    if (map.has(p.uid)) return;
    map.set(p.uid, {
      uid: p.uid,
      displayName: p.displayName || '旅人',
      avatar: normAvatar(p.avatar)
    });
  };
  try { (await api.listFriends()).forEach(add); } catch (e) {}
  try {
    if (api.guildsOk && api.profile && api.profile.guildId) {
      (await api.listMembers()).forEach((m) => add({
        uid: m.uid, displayName: m.displayName, avatar: m.avatar
      }));
    }
  } catch (e) {}
  let extras = [];
  try { extras = await api.listActive(); } catch (e) {}
  shuffle(extras).forEach(add);
  return Array.from(map.values()).slice(0, 10);
};

api.listMyRaids = async function () {
  guardRaid();
  const day = dayId();
  const uid = api.user.uid;
  const out = [];
  for (const slot of [0, 1, 2]) {
    const id = uid + '_' + slot + '_' + day;
    const snap = await getDoc(doc(db, 'raids', id));
    if (snap.exists()) out.push({ id: snap.id, ...snap.data() });
  }
  return out;
};

api.raidPlayer = async function (toUid) {
  guardRaid();
  await ensureProfile();
  if (!toUid || toUid === api.user.uid) throw new Error('self');
  const pref = await getDoc(doc(db, 'players', toUid));
  if (!pref.exists()) throw new Error('not-found');
  const day = dayId();
  const used = await api.listMyRaids();
  if (used.length >= 3) throw new Error('limit');
  let slot = -1;
  for (const s of [0, 1, 2]) {
    if (!used.some((r) => r.id === api.user.uid + '_' + s + '_' + day)) {
      slot = s;
      break;
    }
  }
  if (slot < 0) throw new Error('limit');
  const id = api.user.uid + '_' + slot + '_' + day;
  await setDoc(doc(db, 'raids', id), {
    from: api.user.uid,
    to: toUid,
    day,
    createdAt: serverTimestamp()
  });
  await setDoc(doc(db, 'players', toUid, 'hits', id), {
    from: api.user.uid,
    displayName: api.profile.displayName,
    avatar: api.profile.avatar,
    day,
    createdAt: serverTimestamp()
  });
  const p = pref.data();
  return {
    id,
    to: toUid,
    toName: p.displayName || '旅人',
    toAvatar: p.avatar || 'av_a',
    slot,
    day
  };
};

api.listHits = async function () {
  guardRaid();
  const day = dayId();
  const snap = await getDocs(collection(db, 'players', api.user.uid, 'hits'));
  const rows = [];
  for (const row of snap.docs) {
    const d = row.data() || {};
    if (d.day && d.day !== day) continue;
    let countered = false;
    try {
      const c = await getDoc(doc(db, 'counters', row.id));
      countered = c.exists();
    } catch (e) {}
    let name = d.displayName || '旅人';
    let av = d.avatar || 'av_a';
    try {
      const p = await getDoc(doc(db, 'players', d.from));
      if (p.exists()) {
        name = p.data().displayName || name;
        av = p.data().avatar || av;
      }
    } catch (e) {}
    av = normAvatar(av);
    let ts = Date.now();
    try {
      if (d.createdAt && typeof d.createdAt.toMillis === 'function') ts = d.createdAt.toMillis();
    } catch (e) {}
    rows.push({
      id: row.id,
      from: d.from,
      displayName: name,
      avatar: av,
      day: d.day,
      t: ts,
      r: countered
    });
  }
  rows.sort((a, b) => b.t - a.t);
  return rows;
};

api.counterRaid = async function (hitId) {
  guardRaid();
  await ensureProfile();
  const href = doc(db, 'players', api.user.uid, 'hits', hitId);
  const hs = await getDoc(href);
  if (!hs.exists()) throw new Error('not-found');
  const rs = await getDoc(doc(db, 'raids', hitId));
  if (!rs.exists() || rs.data().to !== api.user.uid) throw new Error('not-found');
  const day = dayId();
  if (rs.data().day !== day) throw new Error('expired');
  const cref = doc(db, 'counters', hitId);
  const cs = await getDoc(cref);
  if (cs.exists()) throw new Error('already');
  await setDoc(cref, {
    from: api.user.uid,
    to: rs.data().from,
    day,
    createdAt: serverTimestamp()
  });
  return { id: hitId, to: rs.data().from, name: hs.data().displayName || '旅人' };
};


async function maybeWriteInvite(inviterUid, inviterCode) {
  if (!api.invitesOk || !api.user || !inviterUid) return false;
  const me = await getDoc(doc(db, 'players', api.user.uid));
  if (!me.exists()) return false;
  const pending = me.data().pendingRef || '';
  if (!pending) return false;
  if (inviterCode && pending !== inviterCode) return false;
  if (!inviterCode) {
    const inviter = await getDoc(doc(db, 'players', inviterUid));
    if (!inviter.exists() || inviter.data().friendCode !== pending) return false;
  }
  const existing = await getDoc(doc(db, 'invites', api.user.uid));
  if (existing.exists()) return false;
  const fr = await getDoc(doc(db, 'players', api.user.uid, 'friends', inviterUid));
  if (!fr.exists()) return false;
  await setDoc(doc(db, 'invites', api.user.uid), {
    inviterUid,
    createdAt: serverTimestamp(),
    claimed: false
  });
  return true;
}

async function recordPendingInvite() {
  if (!api.invitesOk || !api.user) return false;
  const pending = (api.profile && api.profile.pendingRef) || readPendingRef();
  if (!pending) return false;
  const look = await getDoc(doc(db, 'friendCodes', pending));
  if (!look.exists() || !look.data().uid) return false;
  return maybeWriteInvite(look.data().uid, pending);
}

api.listInviteRewards = async function () {
  guardInvite();
  await ensureProfile();
  const uid = api.user.uid;
  const snap = await getDocs(query(collection(db, 'invites'), where('inviterUid', '==', uid)));
  const day = dayId();
  let claimedToday = 0;
  for (const slot of [0, 1, 2, 3, 4]) {
    try {
      const c = await getDoc(doc(db, 'inviteClaims', uid + '_' + slot + '_' + day));
      if (c.exists()) claimedToday += 1;
    } catch (e) {}
  }
  const rows = [];
  for (const row of snap.docs) {
    const d = row.data() || {};
    let name = '新好友', av = 'av_a';
    try {
      const p = await getDoc(doc(db, 'players', row.id));
      if (p.exists()) {
        name = p.data().displayName || name;
        av = p.data().avatar || av;
      }
    } catch (e) {}
    av = normAvatar(av);
    let ts = Date.now();
    try {
      if (d.createdAt && typeof d.createdAt.toMillis === 'function') ts = d.createdAt.toMillis();
    } catch (e) {}
    rows.push({
      id: row.id,
      inviterUid: d.inviterUid,
      claimed: !!d.claimed,
      displayName: name,
      avatar: av,
      t: ts
    });
  }
  rows.sort((a, b) => (a.claimed - b.claimed) || (b.t - a.t));
  return { rows, claimedToday, cap: INVITE_DAILY_CAP, reward: INVITE_REWARD };
};

api.claimInviteReward = async function (inviteId) {
  guardInvite();
  await ensureProfile();
  if (!inviteId) throw new Error('not-found');
  const inv = await getDoc(doc(db, 'invites', inviteId));
  if (!inv.exists() || inv.data().inviterUid !== api.user.uid) throw new Error('not-found');
  if (inv.data().claimed) throw new Error('claimed');
  const day = dayId();
  let slot = -1;
  for (const s of [0, 1, 2, 3, 4]) {
    const c = await getDoc(doc(db, 'inviteClaims', api.user.uid + '_' + s + '_' + day));
    if (!c.exists()) { slot = s; break; }
  }
  if (slot < 0) throw new Error('limit');
  const batch = writeBatch(db);
  batch.set(doc(db, 'inviteClaims', api.user.uid + '_' + slot + '_' + day), {
    inviteId,
    createdAt: serverTimestamp(),
    slot
  });
  batch.update(doc(db, 'invites', inviteId), {
    claimed: true,
    claimedAt: serverTimestamp(),
    claimDay: day,
    claimSlot: slot
  });
  await batch.commit();
  return { inviteId, reward: INVITE_REWARD, slot, day };
};

function linkErr(e, which) {
  const c = (e && (e.code || e.message)) || '';
  const w = which === 'facebook' ? 'Facebook' : (which === 'google' ? 'Google' : '');
  if (/operation-not-allowed/i.test(c)) {
    return which === 'facebook' ? 'FB 登入即將開放' : (which === 'google' ? 'Google 登入即將開放' : '這個登入方式即將開放');
  }
  if (/credential-already-in-use|account-exists-with-different-credential/i.test(c)) {
    const n = w || '這個';
    return n + ' 帳號已經連結到另一位旅人，無法再連到目前的身分。請改用尚未連結過的' + (w ? (' ' + w) : '') + ' 帳號。';
  }
  if (/popup-closed-by-user|cancelled-popup-request/i.test(c)) return '已取消連結';
  if (/popup-blocked/i.test(c)) return '瀏覽器擋住了視窗，正在改用頁面跳轉';
  if (/unauthorized-domain/i.test(c)) return '這個網域還沒有開放登入';
  if (/offline|fb-writes-blocked/i.test(c)) return (window.FB_LOGIN === true) ? '連線後才能連結 Google 或 Facebook' : '連線後才能連結 Google';
  if (/native-google-unavailable/i.test(c)) return 'App 內 Google 連結還需要完成 Firebase Android 設定';
  return '連結沒有成功，請稍後再試';
}
api.linkError = linkErr;
function preferRedirect() {
  try {
    /* Native app uses credential linking, not a WebView redirect */
    if (isNativeApp()) return false;
  } catch (e) {}
  try {
    if (window.matchMedia('(display-mode: standalone)').matches && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '')) return true;
  } catch (e) {}
  return false;
}
function googleProvider() {
  const p = new GoogleAuthProvider();
  p.addScope('profile');
  p.setCustomParameters({ prompt: 'select_account' });
  return p;
}
function facebookProvider() {
  const p = new FacebookAuthProvider();
  p.addScope('public_profile');
  p.addScope('email');
  return p;
}
api.linkedProviders = function () {
  const out = { google: null, facebook: null };
  const u = api.user;
  if (!u || !u.providerData) return out;
  u.providerData.forEach(function (p) {
    if (p.providerId === 'google.com') out.google = { photoURL: photoFromProvider(p), displayName: p.displayName || '' };
    if (p.providerId === 'facebook.com') out.facebook = { photoURL: photoFromProvider(p), displayName: p.displayName || '' };
  });
  return out;
};
api.setAvatar = async function (av) {
  if (!isAvatar(av)) throw new Error('bad-avatar');
  if (api.live && api.writesEnabled) {
    try {
      return await api.updateProfile({ avatar: av });
    } catch (e) {
      try {
        const saved = JSON.parse(localStorage.getItem('dfp_profile') || '{}');
        saved.avatar = av;
        localStorage.setItem('dfp_profile', JSON.stringify(saved));
      } catch (x) {}
      if (api.profile) api.profile.avatar = av;
      emitAv();
      if (isPerm(e)) {
        const err = new Error('local-only');
        err.code = 'local-only';
        throw err;
      }
      throw e;
    }
  }
  try {
    const saved = JSON.parse(localStorage.getItem('dfp_profile') || '{}');
    saved.avatar = av;
    localStorage.setItem('dfp_profile', JSON.stringify(saved));
  } catch (e) {}
  if (api.profile) api.profile.avatar = av;
  emitAv();
  return { avatar: av };
};
async function nativeGoogleIdToken() {
  const cap = window.Capacitor;
  const plugins = (cap && cap.Plugins) || {};
  const opts = { skipNativeAuth: true };
  let res = null;
  if (plugins.FirebaseAuthentication && typeof plugins.FirebaseAuthentication.signInWithGoogle === 'function') {
    res = await plugins.FirebaseAuthentication.signInWithGoogle(opts);
  } else if (plugins.GoogleAuth && typeof plugins.GoogleAuth.signIn === 'function') {
    res = await plugins.GoogleAuth.signIn();
  }
  return (res && res.credential && res.credential.idToken)
    || (res && res.authentication && res.authentication.idToken)
    || (res && res.idToken)
    || '';
}
async function linkGoogleNative() {
  let idToken = '';
  try {
    idToken = await nativeGoogleIdToken();
  } catch (e) {
    const msg = String((e && (e.code || e.message)) || e || '');
    if (/cancel/i.test(msg)) {
      const err = new Error('auth/popup-closed-by-user');
      err.code = 'auth/popup-closed-by-user';
      throw err;
    }
    throw e;
  }
  if (!idToken) {
    const err = new Error('native-google-unavailable');
    err.code = 'native-google-unavailable';
    throw err;
  }
  const cred = GoogleAuthProvider.credential(idToken);
  try {
    const linked = await linkWithCredential(api.user, cred);
    api.user = (linked && linked.user) || api.user;
  } catch (e) {
    if (e && /credential-already-in-use/i.test(String(e.code || e.message || ''))) {
      const signed = await signInWithCredential(auth, cred);
      api.user = (signed && signed.user) || (auth && auth.currentUser) || api.user;
      try { await ensureProfile(); } catch (x) {}
      emitAv();
      return { ok: true, native: true, switched: true };
    }
    throw e;
  }
  try { await ensureProfile(); } catch (x) {}
  emitAv();
  return { ok: true, native: true };
}
api.linkAccount = async function (which) {
  if (!api.live || !api.user) {
    const err = new Error('offline');
    err.code = 'offline';
    throw err;
  }
  const key = which === 'facebook' ? 'facebook' : 'google';
  if (key === 'facebook' && window.FB_LOGIN !== true) {
    const err = new Error('auth/operation-not-allowed');
    err.code = 'auth/operation-not-allowed';
    throw err;
  }
  const have = api.linkedProviders()[key];
  if (have) return { already: true };
  if (key === 'google' && isNativeApp()) {
    return await linkGoogleNative();
  }
  const provider = key === 'facebook' ? facebookProvider() : googleProvider();
  try {
    if (preferRedirect()) {
      try { sessionStorage.setItem('dfp_link_which', key); } catch (e) {}
      await linkWithRedirect(api.user, provider);
      return { redirect: true };
    }
    const cred = await linkWithPopup(api.user, provider);
    api.user = (cred && cred.user) || api.user;
    emitAv();
    return { ok: true };
  } catch (e) {
    if (e && e.code === 'auth/popup-blocked') {
      try { sessionStorage.setItem('dfp_link_which', key); } catch (x) {}
      await linkWithRedirect(api.user, provider);
      return { redirect: true };
    }
    e._which = key;
    throw e;
  }
};

async function probeAndInit() {
  const emu = useEmulator();
  api.emu = emu;
  const app = initializeApp(CFG);
  auth = getAuth(app);
  db = getFirestore(app, FS_DB);
  if (emu) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  try {
    try {
      await getRedirectResult(auth);
    } catch (e) {
      let which = '';
      try { which = sessionStorage.getItem('dfp_link_which') || ''; } catch (x) {}
      api.linkNotice = linkErr(e, which);
    }
    try { sessionStorage.removeItem('dfp_link_which'); } catch (e) {}
    if (!auth.currentUser) await signInAnonymously(auth);
    api.user = auth.currentUser;
    if (!api.user) throw new Error('no-user');
  } catch (e) {
    api.live = false;
    api.writesEnabled = false;
    api.guildsOk = false;
    api.raidsOk = false;
    api.invitesOk = false;
    return false;
  }
  try {
    await getDoc(doc(db, 'players', api.user.uid));
  } catch (e) {
    api.live = false;
    api.writesEnabled = false;
    api.guildsOk = false;
    api.raidsOk = false;
    api.invitesOk = false;
    if (!emu && api.user && api.user.isAnonymous) {
      try { await api.user.delete(); } catch (x) {
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
  try {
    await getDocs(collection(db, 'active', dayId(), 'rows'));
    api.raidsOk = true;
  } catch (e) {
    api.raidsOk = false;
  }
  try {
    await getDocs(query(collection(db, 'invites'), where('inviterUid', '==', api.user.uid)));
    api.invitesOk = true;
  } catch (e) {
    api.invitesOk = false;
  }
  await ensureProfile();
  emitAv();
  if (api.invitesOk) {
    try { await recordPendingInvite(); } catch (e) {}
  }
  if (api.raidsOk) {
    try { await api.heartbeat(); } catch (e) {}
  }
  return true;
}

api.ready = probeAndInit().catch(function () {
  api.live = false;
  api.writesEnabled = false;
  api.guildsOk = false;
  api.raidsOk = false;
  api.invitesOk = false;
  return false;
});
