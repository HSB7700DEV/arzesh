import { Stack, } from "expo-router";
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";


export default function RootLayout() {
  return (
    <Stack
    screenOptions={{
        headerStyle: {
          backgroundColor: '#000000ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',

        },
      }}>
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}

useEffect(() => {
  if (Platform.OS === 'android') {
    NavigationBar.setStyle('dark');
  }
}, []);