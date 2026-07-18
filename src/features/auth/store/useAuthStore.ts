import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const secureStorage = {
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  getItem: (name: string) => SecureStore.getItemAsync(name),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  job: string;
  department: string;
  age: number;
  gender: string;
}

interface AuthState {
  accessToken: string | null;
  employee: Employee | null;
  setAuth: (token: string, employee: Employee) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      employee: null,
      setAuth: (token, employee) => set({ accessToken: token, employee }),
      logout: () => set({ accessToken: null, employee: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);