import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { useAuthStore } from './store/useAuthStore';
import { LoginScreen } from './components/auth/LoginScreen';
import { MainLayout } from './components/layout/MainLayout';
import { preloadPopularFonts } from './utils/googleFonts';

const App: React.FC = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  // Preload Google Fonts
  useEffect(() => {
    preloadPopularFonts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user && !loading ? <LoginScreen /> : null}
        />
        <Route
          path="/"
          element={
            user ? (
              <MainLayout />
            ) : (
              loading ? <div className="h-screen w-screen flex items-center justify-center">Loading...</div> : null
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
