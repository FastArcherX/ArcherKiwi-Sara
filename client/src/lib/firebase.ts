// Using Firebase integration blueprint - firebase_barebones_javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, User } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, off } from "firebase/database";

// Configurazione Firebase opzionale - solo se le variabili d'ambiente sono presenti
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_PROJECT_ID;

let app: any = null;
let auth: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase inizializzato con successo');
} else {
  console.log('Firebase non configurato - usando modalità guest');
}

export { auth };
// export const database = getDatabase(app); // Temporarily disabled - needs proper Firebase configuration

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  if (!auth) {
    console.warn('Firebase non configurato - impossibile effettuare il login');
    return Promise.reject(new Error('Firebase non configurato'));
  }
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  if (!auth) {
    console.warn('Firebase non configurato - impossibile effettuare il logout');
    return Promise.resolve();
  }
  return signOut(auth);
};

// Database operations - Temporarily using local storage until Firebase DB is properly configured
export const saveNote = async (userId: string, note: any) => {
  console.log('Save note (local):', note);
  // TODO: Implement when Firebase DB is properly configured
  return note;
};

export const deleteNote = async (userId: string, noteId: string) => {
  console.log('Delete note (local):', noteId);
  // TODO: Implement when Firebase DB is properly configured
};

export const subscribeToNotes = (userId: string, callback: (notes: any[]) => void) => {
  console.log('Subscribe to notes (local):', userId);
  // Return empty array for now
  callback([]);
  return () => {}; // No-op unsubscribe
};

export const saveFolders = async (userId: string, folders: any[]) => {
  console.log('Save folders (local):', folders);
  // TODO: Implement when Firebase DB is properly configured
};

export const subscribeToFolders = (userId: string, callback: (folders: any[]) => void) => {
  console.log('Subscribe to folders (local):', userId);
  // Return empty array for now
  callback([]);
  return () => {}; // No-op unsubscribe
};