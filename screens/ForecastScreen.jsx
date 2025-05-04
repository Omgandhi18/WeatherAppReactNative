// screens/ForecastScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const ForecastScreen = ({ navigation, weatherData }) => {
  const insets = useSafeAreaInsets();

  if (!weatherData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0080ff" />
        <Text style={styles.loadingText}>Loading forecast data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Weather Details</Text>
      </View>
      
      <ScrollView style={styles.forecastContainer}>
        {/* Main Weather Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.locationName}>{weatherData.name}</Text>
          <Image 
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` }}
            style={styles.weatherIcon}
          />
          <Text style={styles.weatherDescription}>
            {weatherData.weather[0].description.charAt(0).toUpperCase() + 
             weatherData.weather[0].description.slice(1)}
          </Text>
          
          {/* Temperature Section */}
          <View style={styles.tempSection}>
            <View style={styles.tempDetail}>
              <Text style={styles.tempValue}>{Math.round(weatherData.main.temp)}°C</Text>
              <Text style={styles.tempLabel}>Temperature</Text>
            </View>
            <View style={styles.tempDetail}>
              <Text style={styles.tempValue}>{Math.round(weatherData.main.feels_like)}°C</Text>
              <Text style={styles.tempLabel}>Feels Like</Text>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>
                {Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°
              </Text>
              <Text style={styles.detailLabel}>Min / Max</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
              <Text style={styles.detailLabel}>Pressure</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>{(weatherData.visibility / 1000).toFixed(1)} km</Text>
              <Text style={styles.detailLabel}>Visibility</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="arrow-up-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>
                {weatherData.wind.speed.toFixed(1)} m/s
              </Text>
              <Text style={styles.detailLabel}>Wind Speed</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="compass-outline" size={24} color="#0080ff" />
              <Text style={styles.detailValue}>{weatherData.wind.deg}°</Text>
              <Text style={styles.detailLabel}>Wind Direction</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  tempSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tempDetail: {
    alignItems: 'center',
  },
  tempValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  tempLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default ForecastScreen;