import React, { useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db, testFirestoreConnection } from '../firebase/config';
import { LogIn, LogOut, User, Database, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const FirebaseAuthBar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        try {
          // Sync or create user profile document in Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Enterprise User',
              photoURL: user.photoURL || '',
              preferredLanguage: 'English',
              targetWpm: 150,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err: any) {
          console.warn('Firestore profile sync note:', err.message);
        }
      }
    });

    // Test Firestore connection
    testFirestoreConnection().then((ok) => setFirestoreConnected(ok));

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Firestore Status Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px]">Firestore:</span>
          {firestoreConnected ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              Connected (Auth + DB)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              <ShieldCheck className="w-3 h-3" />
              Ready (Zero-Trust Rules)
            </span>
          )}
        </div>

        {authError && (
          <span className="text-[11px] text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {authError}
          </span>
        )}
      </div>

      {/* Right: Auth Profile / Google Sign-In */}
      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-slate-500 font-mono text-[11px]">Checking auth...</span>
        ) : currentUser ? (
          <div className="flex items-center gap-2.5">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-cyan-500/60"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="flex flex-col text-left leading-tight hidden sm:block">
              <span className="text-slate-200 font-bold text-[11px]">
                {currentUser.displayName || 'Authenticated User'}
              </span>
              <span className="text-slate-500 text-[10px] font-mono truncate max-w-[140px]">
                {currentUser.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-all"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
};
