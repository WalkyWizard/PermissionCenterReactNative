import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraPermission } from './components/CameraPermission';
import { LocationPermission } from './components/LocationPermission';
import { ContactsPermission } from './components/ContactsPermission';
import { GalleryPermission } from './components/GalleryPermission';
import { PermissionsStatus } from './components/PermissionsStatus';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PermissionsStatus />
        <View style={styles.main}>
          <CameraPermission />
          <LocationPermission />
          <ContactsPermission />
          <GalleryPermission />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 30,
  },
  main: {
    flex: 1,
  },
});
