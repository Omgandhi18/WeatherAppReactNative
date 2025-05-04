// screens/HomeScreen.js
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation, weatherData, refreshWeather, location, loading, error }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const insets = useSafeAreaInsets();

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!weatherData || !weatherData.main) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0080ff" />
      </View>
    );
  }

  const { main, weather, wind, visibility, sys, dt } = weatherData;
  const currentTemp = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const currentWeather = weather[0];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWeather();
    } catch (error) {
      console.error('Error refreshing weather:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeatherBackground = () => {
    const id = currentWeather.id;
    const isDay = dt > sys.sunrise && dt < sys.sunset;
    
    if (id >= 200 && id < 300) return '#616161'; // Thunderstorm
    if (id >= 300 && id < 400) return '#757575'; // Drizzle
    if (id >= 500 && id < 600) return '#1976d2'; // Rain
    if (id >= 600 && id < 700) return '#b3e5fc'; // Snow
    if (id >= 700 && id < 800) return '#e0e0e0'; // Atmosphere (fog, mist)
    if (id === 800) return isDay ? '#03a9f4' : '#1a237e'; // Clear
    return isDay ? '#4fc3f7' : '#303f9f'; // Clouds
  };

  return (
    <View style={[styles.container, { backgroundColor: getWeatherBackground() }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10 }
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Location header */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={24} color="white" />
          <Text style={styles.locationText}>
            {weatherData.name || 'Loading location...'}
          </Text>
        </View>

        {/* Current weather */}
        <View style={styles.currentWeather}>
          <Image
            source={{ uri: getWeatherIcon(currentWeather.icon) }}
            style={styles.weatherIcon}
          />
          <View style={styles.tempContainer}>
            <Text style={styles.temperature}>{currentTemp}°C</Text>
            <Text style={styles.feelsLike}>Feels like {feelsLike}°C</Text>
          </View>
        </View>

        <Text style={styles.weatherDescription}>
          {currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)}
        </Text>

        {/* Weather details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>{main.humidity}%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>{main.pressure} hPa</Text>
              <Text style={styles.detailLabel}>Pressure</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>{(visibility / 1000).toFixed(1)} km</Text>
              <Text style={styles.detailLabel}>Visibility</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="sunny-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>
                {formatTime(sys.sunrise)}
              </Text>
              <Text style={styles.detailLabel}>Sunrise</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="moon-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>
                {formatTime(sys.sunset)}
              </Text>
              <Text style={styles.detailLabel}>Sunset</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer-outline" size={22} color="#0080ff" />
              <Text style={styles.detailValue}>{wind.speed.toFixed(1)} m/s</Text>
              <Text style={styles.detailLabel}>Wind</Text>
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
  scrollContent: {
    paddingBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 5,
  },
  currentWeather: {
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  tempContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherDescription: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
    color: '#333',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  precipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;