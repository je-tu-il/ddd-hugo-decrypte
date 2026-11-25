import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type Auth, 
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  type Firestore 
} from 'firebase/firestore';
import type { HugoUser, DecrypteSession } from '../types/ddd';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Configuration Firebase intégrée par défaut
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigParams = {
  apiKey: "AIzaSyDFpYsWjv5V3oCDJD2KmW8X9N-sKDVpohg",
  authDomain: "ddd-hugo-decrypte-01.firebaseapp.com",
  projectId: "ddd-hugo-decrypte-01",
  storageBucket: "ddd-hugo-decrypte-01.firebasestorage.app",
  messagingSenderId: "573319104311",
  appId: "1:573319104311:web:f8ad8737116e1de6dcbcb2",
};

const LOCAL_STORAGE_FIREBASE_KEY = 'ddd_firebase_custom_config';

export function getSavedFirebaseConfig(): FirebaseConfigParams {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FIREBASE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading saved firebase config', e);
  }

  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: FirebaseConfigParams) {
  localStorage.setItem(LOCAL_STORAGE_FIREBASE_KEY, JSON.stringify(config));
  window.location.reload();
}

export function clearFirebaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_FIREBASE_KEY);
  window.location.reload();
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const initialConfig = getSavedFirebaseConfig();
try {
  app = getApps().length === 0 ? initializeApp(initialConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase initialization failed with config:', err);
}

export const isFirebaseConfigured = Boolean(app && auth && db);

// Google Sign-In
export async function loginWithGoogle(): Promise<HugoUser> {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const u: User = result.user;
    
    const hugoUser: HugoUser = {
      uid: u.uid,
      displayName: u.displayName || 'Utilisateur Google',
      email: u.email || '',
      photoURL: u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`,
      rankTitle: 'Participant',
      joinedAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, 'users', u.uid), hugoUser, { merge: true });
      } catch (err) {
        console.warn('Failed to sync user to firestore:', err);
      }
    }

    return hugoUser;
  }

  throw new Error("FIREBASE_NOT_CONFIGURED");
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
}

export function subscribeToAuthState(callback: (user: HugoUser | null) => void) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        callback({
          uid: u.uid,
          displayName: u.displayName || 'Utilisateur Google',
          email: u.email || '',
          photoURL: u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`,
          rankTitle: 'Participant',
          joinedAt: new Date().toISOString(),
        });
      } else {
        callback(null);
      }
    });
  }

  callback(null);
  return () => {};
}

// Sync session to cloud
export async function syncSessionToCloud(session: DecrypteSession): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, 'sessions', session.id), session);
  } catch (e) {
    console.error('Could not sync session to Firestore:', e);
  }
}

// Fetch all real cloud users
export async function getCloudUsers(): Promise<HugoUser[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users: HugoUser[] = [];
    snap.forEach((d) => users.push(d.data() as HugoUser));
    return users;
  } catch {
    return [];
  }
}

// Fetch all real cloud sessions
export async function getCloudSessions(): Promise<DecrypteSession[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const snap = await getDocs(collection(db, 'sessions'));
    const sessions: DecrypteSession[] = [];
    snap.forEach((d) => sessions.push(d.data() as DecrypteSession));
    return sessions;
  } catch {
    return [];
  }
}
