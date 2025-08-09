import React from 'react';
import { useState } from 'react';
import { StandaloneScoreboard } from './components/StandaloneScoreboard';
import { AuthProvider } from './contexts/AuthContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { LoginScreen } from './components/LoginScreen';
import { ReservationScreen } from './components/ReservationScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // URL'de scoreboard parametresi varsa direkt skorboard göster
  const urlParams = new URLSearchParams(window.location.search);
  const showScoreboard = urlParams.get('scoreboard') === 'true';

  if (showScoreboard) {
    return (
      <ReservationProvider>
        <StandaloneScoreboard />
      </ReservationProvider>
    );
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthProvider>
      <ReservationProvider>
        {isLoggedIn ? (
          <ReservationScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
