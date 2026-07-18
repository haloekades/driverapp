import { useAuthStore } from '../features/auth/store/useAuthStore';

const BASE_URL = 'https://barrier-marxism-purse.ngrok-free.dev';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().accessToken;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};