import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import {
  findLocalUserByEmail,
  getLocalSession,
  saveLocalUser,
  setLocalSession,
} from '../services/localStore';
import { mapFirebaseError } from '../utils/firebaseErrors';

const AuthContext = createContext(null);

function mapFirebaseUser(fbUser) {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Пользователь',
    email: fbUser.email,
  };
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser) => {
        setUser(fbUser ? mapFirebaseUser(fbUser) : null);
        setLoading(false);
      });
    }

    setUser(getLocalSession());
    setLoading(false);
    return undefined;
  }, []);

  const clearError = () => setError(null);

  const register = async ({ name, email, password }) => {
    clearError();
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        return;
      }

      if (findLocalUserByEmail(email)) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const localUser = {
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash: hashPassword(password),
      };
      saveLocalUser(localUser);
      const session = { id: localUser.id, name, email };
      setLocalSession(session);
      setUser(session);
    } catch (err) {
      setError(mapFirebaseError(err) || 'Ошибка регистрации');
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    clearError();
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, password);
        return;
      }

      const found = findLocalUserByEmail(email);
      if (!found || found.passwordHash !== hashPassword(password)) {
        throw new Error('Неверный email или пароль');
      }

      const session = { id: found.id, name: found.name, email: found.email };
      setLocalSession(session);
      setUser(session);
    } catch (err) {
      setError(mapFirebaseError(err) || 'Ошибка входа');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    clearError();
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
        return;
      }

      const demoUser = {
        id: 'google-demo-user',
        name: 'Google пользователь',
        email: 'google.demo@local.app',
      };
      saveLocalUser({ ...demoUser, provider: 'google' });
      setLocalSession(demoUser);
      setUser(demoUser);
    } catch (err) {
      setError(mapFirebaseError(err) || 'Ошибка входа через Google');
      throw err;
    }
  };

  const logout = async () => {
    clearError();
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setLocalSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        register,
        login,
        loginWithGoogle,
        logout,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
