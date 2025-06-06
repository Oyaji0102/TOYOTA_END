import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet
} from 'react-native';
import { LobbyContext } from '../context/LobbyContext';

import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import createLobbyStyles from '../components/LobbyStyles';

const LobbiesScreen = () => {
  const {
    lobbies,
    connectToLobby,
    disconnectFromLobby,
    joinedLobby,
    deleteLobby
  } = useContext(LobbyContext);

  const { socket } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const styles = createLobbyStyles(theme);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const sendPlayerReadyMessage = (lobbyId, user) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('❗ WebSocket bağlantısı açık değil');
    return;
  }

  const message = {
    type: 'playerReady',
    lobbyId,
    user
  };

  socket.send(JSON.stringify(message));
  console.log('📤 playerReady mesajı gönderildi:', message);
};


  const renderItem = ({ item }) => {
    const isJoined = joinedLobby && joinedLobby.id === item.id;
    const isOwner = isJoined && joinedLobby.owner.id === user.id;
    

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.gameId} ({item.type})</Text>
        <Text style={{ color: theme.subtext }}>👤 {item.owner.email}</Text>
        <Text style={{ color: theme.subtext }}>🔒 {item.isPrivate ? 'Şifreli' : 'Herkese Açık'}</Text>

    {isJoined ? (
  <>

   <TouchableOpacity
  style={isReady ? styles.leaveButton : styles.joinButton}
  onPress={() => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: newReadyState ? 'playerReady' : 'playerUnready',
        lobbyId: item.id,
        user: user
      };
      socket.send(JSON.stringify(message));
      console.log('📤 Gönderilen mesaj:', message);
    }
  }}
>
  <Text style={styles.buttonText}>
    {isReady ? 'Hazır Değilim' : 'Hazırım'}
  </Text>
</TouchableOpacity>


 <TouchableOpacity
      style={styles.leaveButton}
      onPress={() => {
        disconnectFromLobby();
        setIsReady(false); // çıkınca hazır durumu sıfırlanmalı
      }}
    >
      <Text style={styles.buttonText}>Çık</Text>
    </TouchableOpacity>

  </>
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
        ListEmptyComponent={<Text style={{ color: theme.subtext }}>Henüz hiç lobi yok...</Text>}
        extraData={joinedLobby}
      />

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
              placeholderTextColor={theme.placeholder}
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

export default LobbiesScreen;
