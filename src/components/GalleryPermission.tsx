import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { setPermissionStatus } from '../utils/permissionStore';

export function GalleryPermission(): React.JSX.Element {
  const [status, setStatus] = useState<string>('Not requested');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const openGallery = async () => {
    setLoading(true);
    try {
      let isGranted = false;

      try {
        const { status: expoStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (expoStatus === 'granted') {
          isGranted = true;
        }
      } catch (expoErr) {
        console.warn('requestMediaLibraryPermissionsAsync error:', expoErr);
      }

      if (!isGranted && Platform.OS === 'android') {
        try {
          const sdkVersion = typeof Platform.Version === 'number' ? Platform.Version : 33;
          if (sdkVersion < 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              isGranted = true;
            }
          } else {
            isGranted = true;
          }
        } catch (rnErr) {
          console.warn('PermissionsAndroid gallery error:', rnErr);
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      setStatus('Permission granted');
      setPermissionStatus('gallery', true);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Error opening gallery:', error);
      setStatus('Permission denied');
      setPermissionStatus('gallery', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.description}>Доступ до галереї</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={openGallery}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Open Gallery</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>Status: {status}</Text>

      {imageUri && (
        <View style={styles.imageBox}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
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
  imageBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
    padding: 4,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
  },
});
