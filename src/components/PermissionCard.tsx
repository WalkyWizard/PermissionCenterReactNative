import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function PermissionCard(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Camera</Text>
      <Text style={styles.description}>Доступ до камери</Text>

      <TouchableOpacity style={styles.button} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Allow access</Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>Status: Static test card</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d32f2f',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#d32f2f',
    borderWidth: 1,
    borderColor: '#b71c1c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: '#000000',
  },
});
