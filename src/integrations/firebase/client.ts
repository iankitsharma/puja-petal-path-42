
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCv6Tc4olnLyyP0CvkXXIQO-kaHzONRQw",
  authDomain: "rosoryapp.firebaseapp.com",
  projectId: "rosoryapp",
  storageBucket: "rosoryapp.firebasestorage.app",
  messagingSenderId: "727656330332",
  appId: "1:727656330332:web:0d218d0e602acf5beda299",
  measurementId: "G-0KN2TLKJ7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google via Firebase and then with Supabase
export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign-in process");
    
    // Sign in with Firebase
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Firebase sign-in successful");
    
    // Get Firebase ID token
    const idToken = await result.user.getIdToken();
    console.log("Firebase ID token obtained");
    
    // Sign in with Supabase using Firebase token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token: idToken,
    });

    if (error) {
      console.error("Supabase sign-in error:", error);
      throw error;
    }
    
    console.log("Supabase sign-in successful");
    return data;
  } catch (error) {
    console.error('Firebase/Supabase auth error:', error);
    throw error;
  }
};

// Sign out from both Firebase and Supabase
export const signOutFirebase = async () => {
  try {
    console.log("Starting sign-out process");
    await firebaseSignOut(auth);
    console.log("Firebase sign-out successful");
    await supabase.auth.signOut();
    console.log("Supabase sign-out successful");
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export { auth };
