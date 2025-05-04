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
        <Text style={styles.headerTitle}>Weather Forecast</Text>
      </View>
      
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#0080ff',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#0080ff' },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        }}
      >
        <Tab.Screen name="Daily">
          {() => <DailyForecast weatherData={weatherData} navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Hourly">
          {() => <HourlyForecast weatherData={weatherData} navigation={navigation} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const DailyForecast = ({ weatherData, navigation }) => {
  const { daily } = weatherData;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString([], { weekday: 'long' });
  };

  return (
    <ScrollView style={styles.forecastContainer}>
      {daily.map((day) => (
        <TouchableOpacity
          key={day.dt}
          style={styles.dailyItem}
          onPress={() => navigation.navigate('WeatherDetail', {
            data: day,
            type: 'daily',
            title: `${formatDay(day.dt)} Forecast`
          })}
        >
          <View style={styles.dailyLeftSection}>
            <Text style={styles.dailyDay}>{formatDay(day.dt)}</Text>
            <Text style={styles.dailySummary}>{day.summary}</Text>
          </View>
          
          <View style={styles.dailyMiddleSection}>
            <Image 
              source={{ uri: getWeatherIcon(day.weather[0].icon) }}
              style={styles.dailyIcon}
            />
            <View style={styles.precipContainer}>
              <Ionicons 
                name="water-outline" 
                size={12} 
                color={day.pop > 0 ? "#4dabf5" : "#8c8c8c"} 
              />
              <Text style={styles.precipText}>{Math.round(day.pop * 100)}%</Text>
            </View>
          </View>
          
          <View style={styles.dailyRightSection}>
            <Text style={styles.tempHigh}>{Math.round(day.temp.max)}°</Text>
            <Text style={styles.tempLow}>{Math.round(day.temp.min)}°</Text>
          </View>
          
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const HourlyForecast = ({ weatherData, navigation }) => {
  const { hourly } = weatherData;
  const [selectedDay, setSelectedDay] = useState(0);
  
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString([], { weekday: 'long' });
  };

  // Group hourly data by day
  const days = [];
  let currentDay = null;
  let dayHours = [];

  hourly.forEach((hour) => {
    const date = new Date(hour.dt * 1000).toDateString();
    
    if (currentDay !== date) {
      if (currentDay !== null) {
        days.push(dayHours);
      }
      currentDay = date;
      dayHours = [hour];
    } else {
      dayHours.push(hour);
    }
  });
  
  // Push the last day
  if (dayHours.length > 0) {
    days.push(dayHours);
  }

  // Limit to 5 days
  const visibleDays = days.slice(0, 5);

  return (
    <View style={styles.hourlyForecastContainer}>
      {/* Day selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
      >
        {visibleDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.daySelectorItem,
              selectedDay === index && styles.selectedDay
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text 
              style={[
                styles.daySelectorText,
                selectedDay === index && styles.selectedDayText
              ]}
            >
              {formatDay(day[0].dt)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hourly data for selected day */}
      <ScrollView style={styles.hourlyList}>
        {visibleDays[selectedDay]?.map((hour) => (
          <TouchableOpacity
            key={hour.dt}
            style={styles.hourlyItem}
            onPress={() => navigation.navigate('WeatherDetail', {
              data: hour,
              type: 'hourly',
              title: `${formatTime(hour.dt)} Weather`
            })}
          >
            <Text style={styles.hourlyTime}>{formatTime(hour.dt)}</Text>
            
            <View style={styles.hourlyIconContainer}>
              <Image 
                source={{ uri: getWeatherIcon(hour.weather[0].icon) }}
                style={styles.hourlyIcon}
              />
              <Text style={styles.hourlyDescription}>
                {hour.weather[0].description}
              </Text>
            </View>
            
            <View style={styles.hourlyDetailsContainer}>
              <View style={styles.hourlyDetail}>
                <Ionicons name="thermometer-outline" size={16} color="#0080ff" />
                <Text style={styles.hourlyDetailText}>{Math.round(hour.temp)}°C</Text>
              </View>
              
              <View style={styles.hourlyDetail}>
                <Ionicons name="water-outline" size={16} color="#0080ff" />
                <Text style={styles.hourlyDetailText}>{hour.humidity}%</Text>
              </View>
              
              <View style={styles.hourlyDetail}>
                <Ionicons name="speedometer-outline" size={16} color="#0080ff" />
                <Text style={styles.hourlyDetailText}>{hour.pressure}</Text>
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
        ))}
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
    backgroundColor: '#fff',
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dailyLeftSection: {
    flex: 3,
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dailySummary: {
    fontSize: 12,
    color: '#666',
  },
  dailyMiddleSection: {
    flex: 1,
    alignItems: 'center',
  },
  dailyIcon: {
    width: 40,
    height: 40,
  },
  precipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  dailyRightSection: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  tempHigh: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6b6b',
  },
  tempLow: {
    fontSize: 14,
    color: '#4dabf5',
  },
  hourlyForecastContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  daySelector: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  daySelectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedDay: {
    backgroundColor: '#0080ff',
  },
  daySelectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  selectedDayText: {
    color: '#fff',
  },
  hourlyList: {
    flex: 1,
    padding: 15,
  },
  hourlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hourlyTime: {
    width: 70,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  hourlyIconContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourlyIcon: {
    width: 40,
    height: 40,
  },
  hourlyDescription: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
  hourlyDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  hourlyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  hourlyDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
});

export default ForecastScreen;