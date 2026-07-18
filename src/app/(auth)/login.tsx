import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginAPI } from '../../features/auth/api/loginAPI';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      setAuth(data.access_token, data.employee);
      router.replace('/(main)');
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    },
  });

  const handleLogin = () => {
    setErrorMsg('');
    if (!email || !password) return;
    mutation.mutate({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={mutation.isPending}>
        {mutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 28, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#267a75', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 15 },
});