import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AchievementsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Başarımlar</Text>
      <Text>🎯 İlk oyun oynandı</Text>
      <Text>💪 1000 skor elde edildi</Text>
      <Text>🔥 2 saat kesintisiz oynama</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default AchievementsScreen;
