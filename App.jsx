/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Screens
import HomeScreen from './screens/HomeScreen';
import ForecastScreen from './screens/ForecastScreen';
import WeatherDetailScreen from './screens/WeatherDetailScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// API key - replace with your own key
const API_KEY = '6e1f074f2a92b848ef7c41353d792d76';

// Weather API service
export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !data.main) {
      throw new Error('Invalid weather data format');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Let the caller handle the error
  }
};

// Tab Navigator
function TabNavigator({ weatherData, refreshWeather, location }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Forecast') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0080ff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">
        {props => (
          <HomeScreen 
            {...props} 
            weatherData={weatherData} 
            refreshWeather={refreshWeather}
            location={location}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Forecast">
        {props => (
          <ForecastScreen 
            {...props} 
            weatherData={weatherData}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocationAndWeather = async () => {
    setLoading(true);
    try {
      // Check for saved custom location
      const savedLocation = await AsyncStorage.getItem('customLocation');
      
      if (savedLocation) {
        const { latitude, longitude, name } = JSON.parse(savedLocation);
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data);
        setLocation({ latitude, longitude, name });
      } else {
        // Get current location
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }
        
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        // Get location name
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();
        const locationName = geoData[0] ? 
          `${geoData[0].name}, ${geoData[0].country}` : 
          'Current Location';
        
        // Fetch weather data
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data);
        setLocation({ 
          latitude, 
          longitude, 
          name: locationName 
        });
      }
    } catch (err) {
      setError('Error fetching weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0080ff" />
        </View>
      ) : (
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            options={{ headerShown: false }}
          >
            {props => (
              <TabNavigator 
                {...props} 
                weatherData={weatherData} 
                refreshWeather={getLocationAndWeather}
                location={location}
                loading={loading}
                error={error}
              />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="WeatherDetail" 
            component={WeatherDetailScreen}
            options={({ route }) => ({ title: route.params.title })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}