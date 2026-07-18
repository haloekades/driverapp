import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#267a75', 
        tabBarInactiveTintColor: '#8E8E93', 
        headerStyle: {
          backgroundColor: '#267a75',
          elevation: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-sharp" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-sharp" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}