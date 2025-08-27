// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMf6vIEDl3Gf9hQTkxDLamwthk64lZcXk",
  authDomain: "gym-buddies-daaa9.firebaseapp.com",
  projectId: "gym-buddies-daaa9",
  storageBucket: "gym-buddies-daaa9.firebasestorage.app",
  messagingSenderId: "943696529060",
  appId: "1:943696529060:web:a0f291f81d510bacf5c831",
  measurementId: "G-ELVRHZRTN6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- Auth ---
export async function signInWithGoogle() {
  const res = await signInWithPopup(auth, provider);
  const user = res.user;
  await ensureUsername(user); // make sure the user has a username
  return user;
}

export function signOutUser() {
  return signOut(auth);
}

// --- Ensure username ---
export async function ensureUsername(user) {
  // Check if UID already exists in usernames
  const snap = await getDoc(doc(db, "usernames", user.uid));
  if (!snap.exists()) {
    const username = (user.displayName ? user.displayName.replace(/\s/g, "").toLowerCase() : "user") + Math.floor(Math.random() * 1000);
    await setDoc(doc(db, "usernames", username), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      username,
      createdAt: Date.now()
    });
  }
}

// --- Lookup UID by username ---
export const usernameToUid = async (username) => {
  try {
    const docRef = doc(db, "usernames", username);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().uid : null;
  } catch (err) {
    console.error("Failed to fetch UID for username:", err);
    return null;
  }
};

// --- Set username ---
export const setUsername = async (uid, username) => {
  try {
    const docRef = doc(db, "usernames", username);
    await setDoc(docRef, { uid });
  } catch (err) {
    throw new Error("Failed to set username: " + err.message);
  }
};

// --- Friends ---
function requestId(fromUid, toUid) {
  return `${fromUid}_${toUid}`;
}

export async function sendFriendRequest(fromUid, toUid) {
  const ref = doc(db, "friendRequests", requestId(fromUid, toUid));
  await setDoc(ref, { fromUid, toUid, status: "pending", createdAt: Date.now() });
}

export async function acceptFriendRequest(fromUid, toUid) {
  const ref = doc(db, "friendRequests", requestId(fromUid, toUid));
  await updateDoc(ref, { status: "accepted" });

  const ids = [fromUid, toUid].sort();
  const pairId = ids.join("_");
  await setDoc(doc(db, "friends", pairId), { uids: ids, createdAt: Date.now() });
}

export async function rejectFriendRequest(fromUid, toUid) {
  const ref = doc(db, "friendRequests", requestId(fromUid, toUid));
  await updateDoc(ref, { status: "rejected" });
}

export async function cancelFriendRequest(fromUid, toUid) {
  const ref = doc(db, "friendRequests", requestId(fromUid, toUid));
  await updateDoc(ref, { status: "cancelled" });
}
