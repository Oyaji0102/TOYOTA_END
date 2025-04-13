import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Button, StyleSheet, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LobbyContext } from '../context/LobbyContext';
import { GameContext } from '../context/GameContext';
import { getGames } from '../src/api';

const LobbyModal = () => {
  const {
    lobbyModalVisible,
    closeLobbyModal,
    lobbyType,
    setLobbyType,
    eventStartDate,
    setEventStartDate,
    eventEndDate,
    setEventEndDate,
    handleLobbyNext,
    isPrivate,
    setIsPrivate,
    lobbyPassword,
    setLobbyPassword,
    skipGameSelection,
    setSkipGameSelection
  } = useContext(LobbyContext);

  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  const { selectedGame, setSelectedGame } = useContext(GameContext);


  useEffect(() => {
    getGames()
      .then((data) => {
        setGames(data);
        setLoadingGames(false);
      })
      .catch((err) => {
        console.error("Oyunlar alınamadı:", err);
        setLoadingGames(false);
      });
  }, []);

  const onChangeStart = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) setEventStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) setEventEndDate(selectedDate);
  };

  const getGameObj = () => {
    if (!selectedGame) return null;
    if (typeof selectedGame === 'object') return selectedGame;
    return games.find(g => g.id === selectedGame) || null;
  };

  const selectedGameObj = getGameObj();

  return (
    <Modal
      visible={lobbyModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        closeLobbyModal();
        setSkipGameSelection(false);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Lobi Türü Seç</Text>

          <TouchableOpacity onPress={() => setLobbyType('normal')}>
            <Text style={lobbyType === 'normal' ? styles.radioSelected : styles.radioUnselected}>
              🔘 Normal Lobi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setLobbyType('event')}>
            <Text style={lobbyType === 'event' ? styles.radioSelected : styles.radioUnselected}>
              🔘 Etkinlik Lobisi
            </Text>
          </TouchableOpacity>

          {lobbyType === 'event' && (
            <View style={styles.dateSection}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                <Text>📅 Başlangıç: {eventStartDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={eventStartDate}
                  mode="date"
                  display="default"
                  onChange={onChangeStart}
                />
              )}
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                <Text>📅 Bitiş: {eventEndDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={eventEndDate}
                  mode="date"
                  display="default"
                  onChange={onChangeEnd}
                />
              )}
            </View>
          )}

          {selectedGameObj && skipGameSelection ? (
            <View style={{ padding: 10, backgroundColor: '#e3e3e3', borderRadius: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>
                🎮 Seçilen Oyun: {selectedGameObj.name}
              </Text>
            </View>
          ) : (
            <>
              <Text style={{ marginTop: 15, fontWeight: 'bold' }}>🎮 Oyun Seç</Text>
              <Picker
                selectedValue={selectedGameObj?.id || null}
                onValueChange={(value) => {
                  const foundGame = games.find(g => g.id === value);
                  setSelectedGame(foundGame || null);
                }}
                style={{ backgroundColor: '#eee', marginVertical: 10 }}
              >
                <Picker.Item label="Bir oyun seçin..." value={null} />
                {games.map(game => (
                  <Picker.Item key={game.id} label={game.name} value={game.id} />
                ))}
              </Picker>
            </>
          )}

          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <Text style={{ fontSize: 16 }}>{isPrivate ? '✅' : '⬜️'} 🔒 Şifreli Lobi</Text>
            </TouchableOpacity>
            {isPrivate && (
              <View style={{ backgroundColor: '#eee', padding: 10, borderRadius: 8 }}>
                <Text>Şifre:</Text>
                <TextInput
                  secureTextEntry
                  style={styles.passwordInput}
                  value={lobbyPassword}
                  onChangeText={setLobbyPassword}
                  placeholder="Lobi şifresi girin"
                />
              </View>
            )}
          </View>

          <Button title="İleri" onPress={() => handleLobbyNext(selectedGame, skipGameSelection)} />

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  radioUnselected: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  dateSection: {
    marginVertical: 20,
  },
  dateButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 5
  },
});

export default LobbyModal;
