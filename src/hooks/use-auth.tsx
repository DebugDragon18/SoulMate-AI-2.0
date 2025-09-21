"use client";

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// --- AUTHENTICATION DISABLED ---
// To re-enable authentication, set this flag to false
const AUTH_DISABLED = true;
// ---

// Firebase configuration is hardcoded here to prevent client-side loading issues.
const firebaseConfig = {
    apiKey: "AIzaSyAOG9nUaM5Ag7wHrKeMhlJQaHwf0cTTndA",
    authDomain: "emotimate-kzeww.firebaseapp.com",
    projectId: "emotimate-kzeww",
    storageBucket: "emotimate-kzeww.appspot.com",
    messagingSenderId: "296819035804",
    appId: "1:296819035804:web:4cfb91337fe65cc925a759",
};

const mockUser: User = {
  uid: 'mock-user-uid',
  displayName: 'Valued User',
  email: 'user@example.com',
  photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'mock',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  auth: Auth | null;
  app: FirebaseApp | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(AUTH_DISABLED ? mockUser : null);
  const [loading, setLoading] = useState(!AUTH_DISABLED);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (AUTH_DISABLED) return;

    // Initialize Firebase on the client-side.
    const appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(appInstance);
    setApp(appInstance);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (AUTH_DISABLED) {
      console.log("Sign-in is disabled.");
      return;
    }
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/chat');
    } catch (error: any) {
      // Don't log an error if the user cancels the popup
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
     if (AUTH_DISABLED) {
      console.log("Sign-out is disabled.");
      // In a real scenario, you might want to clear local state or redirect
      router.push('/signin'); 
      return;
    }
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, auth, app }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
