import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { setPermissionStatus } from '../utils/permissionStore';

export function LocationPermission(): React.JSX.Element {
  const [status, setStatus] = useState<string>('Not requested');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Цей додаток потребує доступу до вашої геолокації.',
            buttonNeutral: 'Запитати пізніше',
            buttonNegative: 'Скасувати',
            buttonPositive: 'Дозволити',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('Permission denied');
          setPermissionStatus('location', false);
          setLoading(false);
          return;
        }
      }

      const { status: expoStatus } = await Location.requestForegroundPermissionsAsync();

      if (expoStatus === 'granted') {
        setStatus('Permission granted');
        setPermissionStatus('location', true);

        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLatitude(loc.coords.latitude);
          setLongitude(loc.coords.longitude);
        } catch {
          const lastLoc = await Location.getLastKnownPositionAsync();
          if (lastLoc) {
            setLatitude(lastLoc.coords.latitude);
            setLongitude(lastLoc.coords.longitude);
          } else {
            setLatitude(48.4629);
            setLongitude(35.0461);
          }
        }
      } else {
        setStatus('Permission denied');
        setPermissionStatus('location', false);
      }
    } catch (error) {
      console.warn('Error requesting location permission:', error);
      setStatus('Permission denied');
      setPermissionStatus('location', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Location</Text>
      <Text style={styles.description}>Доступ до геолокації</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={requestLocationPermission}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Allow Location</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>Status: {status}</Text>

      {status === 'Permission granted' && latitude !== null && longitude !== null && (
        <View style={styles.coordsBox}>
          <Text style={styles.coordText}>Latitude: {latitude.toFixed(4)}</Text>
          <Text style={styles.coordText}>Longitude: {longitude.toFixed(4)}</Text>
        </View>
      )}
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
  coordsBox: {
    marginTop: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  coordText: {
    fontSize: 14,
    color: '#000000',
  },
});
