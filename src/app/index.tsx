import { Redirect } from 'expo-router';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export default function Index() {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Redirect href="/(main)" />;
}