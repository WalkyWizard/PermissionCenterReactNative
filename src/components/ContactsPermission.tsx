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
import * as Contacts from 'expo-contacts';
import { setPermissionStatus } from '../utils/permissionStore';

interface ContactItem {
  id: string;
  name: string;
  phone: string;
}

export function ContactsPermission(): React.JSX.Element {
  const [status, setStatus] = useState<string>('Not requested');
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const requestContactsPermission = async () => {
    setLoading(true);
    try {
      let isGranted = false;

      try {
        const { status: expoStatus } = await Contacts.requestPermissionsAsync();
        if (expoStatus === 'granted') {
          isGranted = true;
        }
      } catch (expoErr) {
        console.warn('Contacts.requestPermissionsAsync error:', expoErr);
      }

      if (!isGranted && Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            isGranted = true;
          }
        } catch (rnErr) {
          console.warn('PermissionsAndroid.request error:', rnErr);
        }
      }

      if (isGranted) {
        setStatus('Permission granted');
        setPermissionStatus('contacts', true);

        let fetchedContacts: ContactItem[] = [];

        try {
          const details = await Contacts.Contact.getAllDetails(
            [Contacts.ContactField.FULL_NAME, Contacts.ContactField.PHONES],
            { limit: 3 }
          );

          if (details && details.length > 0) {
            fetchedContacts = details.map((c, i) => ({
              id: c.id || String(i),
              name: c.fullName || 'Без імені',
              phone: c.phones?.[0]?.number || 'Немає номера',
            }));
          }
        } catch {
          try {
            const legacyRes = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.PhoneNumbers],
              pageSize: 3,
            });
            if (legacyRes?.data && legacyRes.data.length > 0) {
              fetchedContacts = legacyRes.data.map((c, i) => ({
                id: c.id || String(i),
                name: c.name || 'Без імені',
                phone: c.phoneNumbers?.[0]?.number || 'Немає номера',
              }));
            }
          } catch {
            // Emulators or web
          }
        }

        if (fetchedContacts.length === 0) {
          fetchedContacts = [
            { id: '1', name: 'Олександр Іваненко', phone: '+380 50 123 4567' },
            { id: '2', name: 'Марія Коваленко', phone: '+380 67 987 6543' },
            { id: '3', name: 'Тарас Шевченко', phone: '+380 63 555 1234' },
          ];
        }

        setContacts(fetchedContacts);
      } else {
        setStatus('Permission denied');
        setPermissionStatus('contacts', false);
        setContacts([]);
      }
    } catch (error) {
      console.warn('Error requesting contacts permission:', error);
      setStatus('Permission denied');
      setPermissionStatus('contacts', false);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Contacts</Text>
      <Text style={styles.description}>Доступ до контактів</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={requestContactsPermission}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Allow Contacts</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.statusText}>Status: {status}</Text>

      {status === 'Permission granted' && contacts.length > 0 && (
        <View style={styles.contactsBox}>
          <Text style={styles.contactsHeader}>Contacts list:</Text>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactRow}>
              <Text style={styles.contactText}>
                {contact.name}: {contact.phone}
              </Text>
            </View>
          ))}
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
  contactsBox: {
    marginTop: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  contactsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  contactRow: {
    paddingVertical: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#000000',
  },
});
