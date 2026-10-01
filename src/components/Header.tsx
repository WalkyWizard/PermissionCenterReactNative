import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Header(): React.JSX.Element {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Permission Center</Text>
      <Text style={styles.subtitle}>Керування дозволами пристрою</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#222222',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111111',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
  },
  divider: {
    width: '60%',
    height: 2,
    backgroundColor: '#dddddd',
    marginTop: 12,
  },
});
