import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { auth, signInWithGoogle as firebaseGoogleSignIn, signOutFirebase } from '@/integrations/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Firebase auth listener
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user logged in");
      } else {
        console.log("Firebase user logged out");
      }
    });

    // Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            await fetchUserProfile(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutFirebase();
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setError(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await firebaseGoogleSignIn();
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        profile, 
        isLoading, 
        error,
        signOut, 
        signInWithGoogle,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};