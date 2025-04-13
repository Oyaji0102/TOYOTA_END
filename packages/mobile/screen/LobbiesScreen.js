import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LobbyContext } from '../context/LobbyContext';
import { AuthContext } from '../context/AuthContext';

const LobbiesScreen = () => {
  const {
    lobbies,
    connectToLobby,
    disconnectFromLobby,
    joinedLobby,
    deleteLobby
  } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);


  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);

  const renderItem = ({ item }) => {
    const isJoined = joinedLobby && joinedLobby.id === item.id;
    const isOwner = isJoined && joinedLobby.owner.id === user.id;




    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.gameId} ({item.type})</Text>
        <Text>👤 {item.owner.email}</Text>
        <Text>🔒 {item.isPrivate ? 'Şifreli' : 'Herkese Açık'}</Text>

        {isJoined ? (
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => disconnectFromLobby()}
          >
            <Text style={styles.buttonText}>Çık</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              if (item.isPrivate) {
                setSelectedLobbyId(item.id);
                setPasswordModalVisible(true);
              } else {
                connectToLobby(item.id);
              }
            }}
          >
            <Text style={styles.buttonText}>Katıl</Text>
          </TouchableOpacity>
        )}

{isOwner && (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deleteLobby(item.id)}
  >
    <Text style={styles.buttonText}>Sil</Text>
  </TouchableOpacity>
)}


      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🧩 Aktif Lobiler</Text>

      <FlatList
        data={lobbies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Henüz hiç lobi yok...</Text>}
        extraData={joinedLobby}
      />

      {/* 🔐 Şifreli Lobi Girişi */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🔐 Şifreli Lobi</Text>
            <TextInput
              placeholder="Lobi şifresi"
              secureTextEntry
              value={enteredPassword}
              onChangeText={setEnteredPassword}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                connectToLobby(selectedLobbyId, enteredPassword);
                setPasswordModalVisible(false);
                setEnteredPassword('');
              }}
            >
              <Text style={styles.buttonText}>Katıl</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  joinButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    padding: 5,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default LobbiesScreen;
