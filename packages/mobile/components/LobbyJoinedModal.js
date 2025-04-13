import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LobbyContext } from '../context/LobbyContext';
import { sendLocalNotification } from './notifications';

const LobbyJoinedModal = () => {
  const {
    lobbyJoinedModalVisible,
    setLobbyJoinedModalVisible,
    joinedLobby,
  } = useContext(LobbyContext);

  if (!lobbyJoinedModalVisible || !joinedLobby) return null; // ⚠️ dışarıdan görünme engeli

  const lobbyURL = `ws://192.168.29.136:4000/lobby/${joinedLobby.id}`; // kendi IP'ne göre ayarla

  const handleCopy = async () => {
    await Clipboard.setStringAsync(lobbyURL);
    sendLocalNotification('🔗 Kopyalandı', 'Lobi bağlantısı panoya eklendi.');
  };

  const handleOpenURL = () => {
    try {
      Linking.openURL(lobbyURL);
    } catch (e) {
      console.warn("❗ URL açılamadı:", lobbyURL);
    }
  };

  return (
    <Modal
      visible={lobbyJoinedModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setLobbyJoinedModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>✅ Lobiye Katıldınız!</Text>

          <Text style={styles.label}>Lobi ID:</Text>
          <Text style={styles.value}>{joinedLobby.id}</Text>

          <Text style={styles.label}>Bağlantı:</Text>
          <View style={styles.panoContainer}>
  <TouchableOpacity onPress={handleOpenURL}>
    <Text style={styles.urlText}>{lobbyURL}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
    <Text style={styles.copyButtonText}>📋 Kopyala</Text>
  </TouchableOpacity>
</View>


          <Text style={styles.label}>Katılımcılar:</Text>
          <FlatList
            data={joinedLobby.members}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <Text style={styles.member}>👤 {item.email}</Text>
            )}
            style={{ maxHeight: 100 }}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setLobbyJoinedModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 10,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  panoContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  
  urlText: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 6,
    textDecorationLine: 'underline',
  },
  value: {
    marginBottom: 8,
  },
  url: {
    color: '#007AFF',
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
  },
  member: {
    fontSize: 15,
    paddingVertical: 2,
  },
});

export default LobbyJoinedModal;
