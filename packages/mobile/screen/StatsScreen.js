import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const StatsScreen = () => {
  const { theme } = useTheme();

  const stats = [
    { label: 'Oynanan oyun', value: '12' },
    { label: 'Toplam süre', value: '5 saat' },
    { label: 'Toplam skor', value: '7800' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>📊 İstatistikler</Text>

      {stats.map((item, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}
        >
          <Text style={[styles.label, { color: theme.subtext }]}>{item.label}:</Text>
          <Text style={[styles.value, { color: theme.text }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Orbitron-Bold',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
  },
});

export default StatsScreen;
