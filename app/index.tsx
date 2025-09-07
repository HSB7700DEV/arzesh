import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';

// --- Type Definitions ---
// This defines the structure for a single price item (e.g., gold or tether)
interface PriceItem {
  value: string;
  change: string;
}

// This defines the structure of the entire JSON object returned by your Cloudflare Worker
interface PriceData {
  gold: PriceItem;
  tether: PriceItem;
}

// --- API Configuration ---
// ⚠️ IMPORTANT: Replace this URL with the one for your deployed Cloudflare Worker
const API_ENDPOINT = 'https://gold-prize-api.hssdbrv.workers.dev/';

// This function makes the network request to your Cloudflare Worker API
const fetchPricesFromAPI = async (): Promise<PriceData> => {
  console.log("Attempting to fetch prices from API...");
  const response = await fetch(API_ENDPOINT);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error('Failed to fetch data from the API.');
  }

  const data: PriceData = await response.json();
  console.log("Successfully fetched data");
  return data;
};

// --- Helper Functions & Components ---
const getChangeColor = (change: string) => {
  if (change.includes('+')) return '#4CAF50'; // Green for positive
  if (change.includes('-')) return '#F44336'; // Red for negative
  return '#A0A0A0'; // Neutral gray
};

// A reusable component to display a price card for an item
const PriceCard = ({ title, data, icon }: { title: string, data: PriceItem, icon: React.ReactNode }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
        {icon}
        <Text style={styles.itemName}>{title}</Text>
    </View>
    
    <View style={styles.priceContainer}>
        <View style={styles.priceAndChange}>
            <Text style={styles.priceText}>{data.value}</Text>
            <Text style={[styles.changeText, { color: getChangeColor(data.change) }]}>
                {data.change}
            </Text>
        </View>
        <Text style={styles.currencyText}>ریال</Text>
    </View>
  </View>
);

// --- Main App Screen ---
export default function HomeScreen() {
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
      console.error("Failed to fetch prices:", e);
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
      <StatusBar style="light" />

      <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffd700ff" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : priceData ? (
          <>
            <PriceCard 
              title="هر گرم طلای ۱۸ عیار" 
              data={priceData.gold} 
              icon={<FontAwesome5 name="ring" size={24} color="#FFD700" />}
            />
            <PriceCard 
              title="تتر" 
              data={priceData.tether}
              icon={<FontAwesome5 name="dollar-sign" size={24} color="#4CAF50" />}
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
            <MaterialIcons name="refresh" size={24} color="#121212" />
        </TouchableOpacity>
        <Stack.Screen
        options={{
          title: 'Arzesh',
          headerStyle: { backgroundColor: '#000000ff' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'black',
          },
        }}
      />
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    alignItems: 'center',
    
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EAEAEA',
  },
  card: {
    width: '85%',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 0,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 15,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 18,
    color: '#E0E0E0',
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
    color: '#FFD700',
    letterSpacing: 1,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  currencyText: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 10,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
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
    color: '#888',
  },
  refreshButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 50, // Makes it a circle
  },
});

