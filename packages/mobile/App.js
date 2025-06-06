import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { AuthProvider } from './context/AuthContext';
import { LobbyProvider } from './context/LobbyContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Navigation from './Navigation';
import LobbyJoinedModal from './components/LobbyJoinedModal';
import LobbyModal from './components/LobbyModal';
import GameDetailModal from './components/GameDetailModal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function MainApp() {
  const { theme } = useTheme();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('📛 Bildirim izni verilmedi.');
      }
    };

    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <GameProvider>
        <LobbyProvider>
          <Navigation />
          <LobbyModal />
          <GameDetailModal />
          <LobbyJoinedModal />
        </LobbyProvider>
      </GameProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
