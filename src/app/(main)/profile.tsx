import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export default function ProfileScreen() {
  const { employee, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{employee?.name || '-'}</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{employee?.email || '-'}</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Job Title</Text>
          <Text style={styles.value}>{employee?.job || '-'}</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{employee?.age} years</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{employee?.gender}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#267a75',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 14,
    padding: 16
  },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 12, color: '#888', fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#333', marginBottom: 5 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 16 },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8, 
  },
});