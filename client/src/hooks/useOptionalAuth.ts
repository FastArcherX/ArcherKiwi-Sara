import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Hook sicuro per l'autenticazione che gestisce il caso in cui Firebase non è configurato
export function useOptionalAuth(): [User | null, boolean] {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase non configurato - modalità guest
      setUser(null);
      setLoading(false);
      return;
    }

    // Firebase configurato - ascolta i cambiamenti di autenticazione
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return [user, loading];
}

// Flag per verificare se Firebase è configurato
export const hasFirebaseConfigured = !!auth;