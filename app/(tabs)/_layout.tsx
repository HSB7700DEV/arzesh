import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// Define color palettes for the tab bar
const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#121212',
    tabIconDefault: '#ccc',
    tabIconSelected: '#e0ca02ff',
    headerBackground: '#FFFFFF',
  },
  dark: {
    background: '#1E1E1E',
    text: '#FFFFFF',
    tabIconDefault: '#ccc',
    tabIconSelected: '#FFD700',
    headerBackground: '#000000',
  }
};

// A helper component for the tab icons
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>['name']; color: string }) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: '#333',
        },
        headerShown: true, // This will show the header defined in the root layout
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.text, // Controls back button and default title color
        // This explicitly sets the color for the title text, fixing the issue.
        headerTitleStyle: {
          color: theme.text,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Arzesh',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart-line" color={color} />,
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="" color={color} />,
        headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}
