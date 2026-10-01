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
import * as ImagePicker from 'expo-image-picker';
import { setPermissionStatus } from '../utils/permissionStore';

export function CameraPermission(): React.JSX.Element {
  const [status, setStatus] = useState<string>('Not requested');
  const [loading, setLoading] = useState<boolean>(false);

  const requestCameraPermission = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'android') {
        const isAlreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

        if (isAlreadyGranted) {
          setStatus('Permission granted (already allowed)');
          setPermissionStatus('camera', true);
          setLoading(false);
          return;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('Permission granted');
          setPermissionStatus('camera', true);
        } else {
          setStatus('Permission denied');
          setPermissionStatus('camera', false);
        }
      } else if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            setStatus('Permission granted');
            setPermissionStatus('camera', true);
          } catch {
            setStatus('Permission denied');
            setPermissionStatus('camera', false);
          }
        } else {
          setStatus('Permission denied');
          setPermissionStatus('camera', false);
        }
      } else {
        // iOS using Expo ImagePicker camera permission requester
        const res = await ImagePicker.requestCameraPermissionsAsync();
        if (res.granted) {
          setStatus('Permission granted');
          setPermissionStatus('camera', true);
        } else {
          setStatus('Permission denied');
          setPermissionStatus('camera', false);
        }
      }
    } catch (error) {
      console.warn('Error requesting camera permission:', error);
      setStatus('Permission denied');
      setPermissionStatus('camera', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Camera</Text>
      <Text style={styles.description}>Доступ до камери</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={requestCameraPermission}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Allow Camera</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>Status: {status}</Text>
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
