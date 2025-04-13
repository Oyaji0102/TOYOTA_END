import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { logout, getGames } from '../src/api';
import { AuthContext } from '../context/AuthContext';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

import LobbyModal from '../components/LobbyModal';
import GameDetailModal from '../components/GameDetailModal';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const { connectToLobby, openLobbyModal } = useContext(LobbyContext);
  const { setSelectedGame, setGameDetailModalVisible } = useContext(GameContext);

  const [games, setGames] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getGames()
      .then((data) => setGames(data))
      .catch((err) => console.log("Oyunlar alınamadı:", err));
  }, []);

  const handleLogout = () => {
    logout().then(() => setUser(null));
  };

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={[styles.gameCard, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
      onPress={() => {
        setSelectedGame(item);
        setGameDetailModalVisible(true);
      }}
    >
      <Image source={{ uri: item.icon }} style={styles.gameIcon} />
      <Text style={[styles.gameName, { color: theme.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const animateSwitch = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    toggleTheme();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Tema Switch */}
      <View style={styles.themeSwitch}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={animateSwitch}
            thumbColor={theme.mode === 'dark' ? '#fff' : '#000'}
            trackColor={{ false: '#bbb', true: '#666' }}
          />
        </Animated.View>
      </View>

      <Text style={[styles.welcome, { color: theme.text }]}>
        Hoş geldin, {user?.email} 🎮
      </Text>

      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Alt Menü */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Profile")}>
          <Feather name="user" size={22} color={theme.text} />
          <Text style={[styles.tabText, { color: theme.text }]}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Stats")}>
          <Feather name="bar-chart-2" size={22} color={theme.text} />
          <Text style={[styles.tabText, { color: theme.text }]}>İstatistik</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={openLobbyModal}>
          <Feather name="plus-circle" size={22} color={theme.text} />
          <Text style={[styles.tabText, { color: theme.text }]}>Lobi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Lobbies")}>
          <Feather name="archive" size={22} color={theme.text} />
          <Text style={[styles.tabText, { color: theme.text }]}>Lobiler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.text} />
          <Text style={[styles.tabText, { color: theme.text }]}>Sohbet</Text>
        </TouchableOpacity>
      </View>

      <LobbyModal />
      <GameDetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Orbitron-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameCard: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 14,
    marginHorizontal: 10,
    flex: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gameIcon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  gameName: {
    fontWeight: '600',
    fontFamily: 'Orbitron-Bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Orbitron-Bold',
  },
  themeSwitch: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

export default HomeScreen;
