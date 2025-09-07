import { Stack, } from "expo-router";

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
