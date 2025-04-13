// components/GameDetailModal.js
import React, { useContext } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';

const GameDetailModal = () => {
  const { selectedGame, setSelectedGame } = useContext(GameContext);
  const { openLobbyModal, lobbies, setSkipGameSelection } = useContext(LobbyContext);

  if (!selectedGame) return null;

  const relatedLobbies = lobbies.filter(l => l.gameId === selectedGame.id);

  return (
    <Modal
      visible={!!selectedGame}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedGame(null)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>{selectedGame.name}</Text>
            <Text style={styles.sectionTitle}>🎯 Oyun Hakkında</Text>
            <Text style={styles.text}>{selectedGame.description}</Text>

            <Text style={styles.sectionTitle}>📋 Aktif Lobiler</Text>
            {relatedLobbies.length > 0 ? relatedLobbies.map(l => (
              <Text key={l.id} style={styles.text}>🔹 {l.id}</Text>
            )) : <Text style={styles.text}>Aktif lobi bulunamadı.</Text>}

            <Text style={styles.sectionTitle}>📜 Oyun Geçmişi</Text>
            <Text style={styles.text}>{selectedGame.history}</Text>

            <Text style={styles.sectionTitle}>📖 Nasıl Oynanır</Text>
            <Text style={styles.text}>{selectedGame.howToPlay}</Text>

            <Text style={styles.sectionTitle}>⚙️ Ayarlar</Text>
            <Text style={styles.text}>{selectedGame.settings}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSkipGameSelection(true);   // Oyunu seçimi atlanacak!
                openLobbyModal();
              }}
            >
              <Text style={styles.buttonText}>➕ Lobi Oluştur</Text>
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '90%', maxHeight: '85%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  text: { fontSize: 16, color: '#333' },
  button: { backgroundColor: '#2e86de', padding: 12, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  closeButton: { marginTop: 10, alignItems: 'center' },
  closeText: { color: '#e74c3c', fontWeight: 'bold' },
});

export default GameDetailModal;
