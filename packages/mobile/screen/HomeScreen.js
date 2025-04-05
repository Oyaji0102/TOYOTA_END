import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { logout } from '../src/api';
import { AuthContext } from '../context/AuthContext';

export default () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    logout().then(() => setUser(null));
  };

  return (
    <View>
      <Text>Hoşgeldin, {user?.email || "Misafir"}!</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
};
