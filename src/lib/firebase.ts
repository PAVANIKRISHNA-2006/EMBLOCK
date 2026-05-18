import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore with long polling to bypass potential network issues in iFrame/sandbox
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test - wrap in a timeout to avoid blocking startup too long
async function testConnection() {
  try {
    // We expect this to fail with "insufficient permissions" if transport is working
    // because no rules allow access to 'test/connection'
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.code === 'unavailable' || (error.message && error.message.includes('the client is offline'))) {
      console.error("Firestore connectivity issue: Please check your Internet connection or Firebase project status.");
    } else {
      console.log("Firestore transport verified (Permission check passed/failed as expected)");
    }
  }
}
testConnection();

export { signInWithPopup, onAuthStateChanged };
export type { User };
