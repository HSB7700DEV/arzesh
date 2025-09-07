import { Stack } from "expo-router";
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform, useColorScheme } from "react-native";

// Define our color palettes
const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#121212',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // This hook now correctly sets the Android navigation bar color based on the theme
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(theme.background);
      NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
    }
  }, [colorScheme]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Arzesh' }} />
    </Stack>
  );
}