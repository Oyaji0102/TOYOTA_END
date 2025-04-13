import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ChatScreen = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      user: user?.email || 'Anonim',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={styles.user}>{item.user}:</Text> {item.text}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesaj yaz..."
          style={styles.input}
        />
        <Button title="Gönder" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  message: {
    fontSize: 16,
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
  },
  user: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;
