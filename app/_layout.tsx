import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Toast from 'react-native-toast-message';

// Define our color palettes
const Colors = {
  light: { background: '#FFFFFF', text: '#121212' },
  dark: { background: '#000000', text: '#FFFFFF' }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    // The Toast component is added here to be globally available
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
