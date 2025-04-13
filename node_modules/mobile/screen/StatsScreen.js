import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 İstatistikler</Text>
      <Text>Oynanan oyun: 12</Text>
      <Text>Toplam süre: 5 saat</Text>
      <Text>Toplam skor: 7800</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default StatsScreen;
