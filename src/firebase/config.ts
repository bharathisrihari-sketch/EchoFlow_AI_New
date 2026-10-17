import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Configuration loaded from provisioned firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0810737076",
  appId: "1:1031782692474:web:43ce19fdb7e3daeddf6dc3",
  apiKey: "AIzaSyCdfJb8ZUB7oeOivHgNfI_NKY3IBDei__U",
  authDomain: "gen-lang-client-0810737076.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-echoflowai-8aa0eb88-6393-4183-b5b4-fdec4eb0ebb5",
  storageBucket: "gen-lang-client-0810737076.firebasestorage.app",
  messagingSenderId: "1031782692474",
  measurementId: "",
  oAuthClientId: "1031782692474-bak6kggakf8gv08urb6pmfbun7t7qnrg.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore on initialization
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn("Firestore offline check note:", error.message);
    }
    return false;
  }
}

// Initial connection test
testFirestoreConnection().catch(() => {});
