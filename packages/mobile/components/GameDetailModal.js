import React, { useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const GameDetailModal = () => {
  const { selectedGame, setSelectedGame } = useContext(GameContext);
  const { openLobbyModal, lobbies, setSkipGameSelection } = useContext(LobbyContext);
  const { theme } = useTheme();

  if (!selectedGame) return null;

  const relatedLobbies = lobbies.filter(l => l.gameId === selectedGame.id);

  const sections = [
    { title: 'Oyun Hakkında', icon: 'info', content: selectedGame.description },
    {
      title: 'Aktif Lobiler',
      icon: 'users',
      content: relatedLobbies.length > 0
        ? relatedLobbies.map(l => `- ${l.id}`).join('\n')
        : 'Aktif lobi bulunamadı.'
    },
    { title: 'Oyun Geçmişi', icon: 'clock', content: selectedGame.history },
    { title: 'Nasıl Oynanır', icon: 'gamepad-variant-outline', iconLib: MaterialCommunityIcons, content: selectedGame.howToPlay },
    { title: 'Ayarlar', icon: 'settings', content: selectedGame.settings }
  ];

  return (
    <Modal
      visible={!!selectedGame}
      animationType="slide"
      transparent
      onRequestClose={() => setSelectedGame(null)}
    >
      <View style={[styles.overlay, {
        backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.3)'
      }]}>
        <View style={[styles.modal, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <ScrollView>
            <Text style={[styles.title, { color: theme.text }]}>{selectedGame.name}</Text>

            {sections.map(({ title, icon, content, iconLib }, index) => (
              <View key={index}>
                <View style={styles.sectionHeader}>
                  {(iconLib || Feather).render ? (
                    React.createElement(iconLib || Feather, {
                      name: icon,
                      size: 18,
                      color: theme.text,
                      style: styles.icon
                    })
                  ) : null}
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
                </View>
                <Text style={[styles.text, { color: theme.text }]}>{content}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSkipGameSelection(true);
                openLobbyModal();
              }}
            >
              <Text style={styles.buttonText}>Lobi Oluştur</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedGame(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Orbitron-Bold'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5
  },
  icon: {
    marginRight: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    marginBottom: 5
  },
  button: {
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  closeText: {
    color: '#e74c3c',
    fontWeight: 'bold'
  },
});

export default GameDetailModal;
