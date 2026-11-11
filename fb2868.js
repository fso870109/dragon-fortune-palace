/* 龍運金殿 v28.68: Firebase Auth＋Firestore（模組 SDK，不含 Analytics） */
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

const api = {
  ready: null,
  live: false,
  emu: false,
  writesEnabled: false,
  user: null,
  profile: null,
  GIFT, BONUS, AVATARS, AVQ, dayId, faceHtml, normCode
};
window.DFPfb = api;
window.DFPface = faceHtml;

let auth, db;

function guardWrite() {
  if (!api.writesEnabled || !api.live || !api.user) {
    throw new Error('fb-writes-blocked');
  }
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
      friendCode: p.friendCode
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
      api.profile = { uid, displayName, avatar, level, friendCode };
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
    return false;
  }
  api.user = cred.user;
  try {
    await getDoc(doc(db, 'players', cred.user.uid));
  } catch (e) {
    api.live = false;
    api.writesEnabled = false;
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
  await ensureProfile();
  return true;
}

api.ready = probeAndInit().catch(function () {
  api.live = false;
  api.writesEnabled = false;
  return false;
});
