import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, useColorScheme, ColorSchemeName } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// --- Color Palettes ---
const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#121212',
    card: '#F0F0F0',
    cardHeaderText: '#333333',
    subtleText: '#555555',
    gold: '#D4AF37',
    green: '#4CAF50',
    red: '#F44336',
    neutral: '#A0A0A0',
    button: '#212121',
    buttonText: '#FFFFFF'
  },
  dark: {
    background: '#000000',
    text: '#EAEAEA',
    card: '#1E1E1E',
    cardHeaderText: '#CCCCCC',
    subtleText: '#888888',
    gold: '#FFD700',
    green: '#4CAF50',
    red: '#F44336',
    neutral: '#A0A0A0',
    button: '#FFD700',
    buttonText: '#121212'
  }
};

// --- Type Definitions ---
interface PriceItem {
  value: string;
  change: string;
}
interface PriceData {
  gold: PriceItem;
  tether: PriceItem;
}

// --- API Configuration ---
const API_ENDPOINT = 'https://sierrabravo.hssdbrv.workers.dev/api/currency';
const fetchPricesFromAPI = async (): Promise<PriceData> => {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch data from the API.');
  }
  return response.json();
};

// --- Helper Functions & Components ---
const getChangeColor = (change: string, theme: typeof Colors.light) => {
  if (change.includes('+')) return theme.green;
  if (change.includes('-')) return theme.red;
  return theme.neutral;
};

// A reusable themed component for the price cards
const PriceCard = ({ title, data, icon, theme }: { title: string, data: PriceItem, icon: React.ReactNode, theme: typeof Colors.light }) => (
  <View style={getStyles(theme).card}>
    <View style={getStyles(theme).cardHeader}>
        {icon}
        <Text style={getStyles(theme).itemName}>{title}</Text>
    </View>
    <View style={getStyles(theme).priceContainer}>
        <View style={getStyles(theme).priceAndChange}>
            <Text style={getStyles(theme).priceText}>{data.value}</Text>
            <Text style={[getStyles(theme).changeText, { color: getChangeColor(data.change, theme) }]}>
                {data.change}
            </Text>
        </View>
        <Text style={getStyles(theme).currencyText}>ریال</Text>
    </View>
  </View>
);

// --- Main App Screen ---
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = getStyles(theme); // Get styles dynamically

  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadPrices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPricesFromAPI();
      setPriceData(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError('امکان دریافت قیمت وجود نداشت. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.gold} style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : priceData ? (
          <>
            <PriceCard 
              title="هر گرم طلای ۱۸ عیار" 
              data={priceData.gold} 
              icon={<FontAwesome5 name="ring" size={24} color={theme.gold} />}
              theme={theme}
            />
            <PriceCard 
              title="تتر" 
              data={priceData.tether}
              icon={<FontAwesome5 name="dollar-sign" size={24} color={theme.green} />}
              theme={theme}
            />
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {lastUpdated && !isLoading && (
            <Text style={styles.updateText}>
            آخرین بروزرسانی: {lastUpdated.toLocaleTimeString('fa-ir')}
            </Text>
        )}
        <TouchableOpacity style={styles.refreshButton} onPress={loadPrices} disabled={isLoading}>
            <MaterialIcons name="refresh" size={24} color={theme.buttonText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Dynamic Stylesheet ---
// This function creates the styles based on the current theme
const getStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
    paddingBottom: 15,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 18,
    color: theme.text,
    fontWeight: '500',
    marginRight: 10,
  },
  priceContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  priceAndChange: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.gold,
    letterSpacing: 1,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  currencyText: {
    fontSize: 18,
    color: theme.gold,
    marginLeft: 10,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: theme.red,
    textAlign: 'center',
    marginTop: 50,
  },
  footer: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  updateText: {
    fontSize: 14,
    color: theme.subtleText,
  },
  refreshButton: {
    backgroundColor: theme.button,
    padding: 15,
    borderRadius: 50,
  },
});