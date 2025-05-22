
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google via Firebase and then with Supabase
export const signInWithGoogle = async () => {
  try {
    // Sign in with Firebase
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get Firebase ID token
    const idToken = await result.user.getIdToken();
    
    // Sign in with Supabase using Firebase token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token: idToken,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Firebase/Supabase auth error:', error);
    throw error;
  }
};

// Sign out from both Firebase and Supabase
export const signOutFirebase = async () => {
  try {
    await firebaseSignOut(auth);
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export { auth };
