import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const Colors = {
  light: { background: '#FFFFFF', text: '#121212' },
  dark: { background: '#000000', text: '#EAEAEA' }
};

export default function ConverterScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      
    </View>
  );
}

const getStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  subtext: {
    fontSize: 16,
    color: theme.text,
    marginTop: 8,
  }
});
