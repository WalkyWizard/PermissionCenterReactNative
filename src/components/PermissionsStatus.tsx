import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePermissionsState } from '../utils/permissionStore';

export function PermissionsStatus(): React.JSX.Element {
  const permissions = usePermissionsState();

  const formatStatus = (granted: boolean | null): string => {
    if (granted === true) return 'Granted';
    if (granted === false) return 'Denied';
    return 'Not requested';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Permissions status</Text>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Camera:</Text>
        <Text style={styles.value}>{formatStatus(permissions.camera)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{formatStatus(permissions.location)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Contacts:</Text>
        <Text style={styles.value}>{formatStatus(permissions.contacts)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Gallery:</Text>
        <Text style={styles.value}>{formatStatus(permissions.gallery)}</Text>
      </View>
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
    color: '#d32f2f',
    marginBottom: 6,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#d32f2f',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: {
    fontSize: 14,
    color: '#000000',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
});
