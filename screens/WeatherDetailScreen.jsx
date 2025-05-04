// screens/WeatherDetailScreen.js
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const WeatherDetailScreen = ({ route }) => {
  const { data, type } = route.params;
  
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString([], { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderHourlyDetail = () => {
    const { temp, feels_like, humidity, pressure, wind_speed, 
            visibility, weather, pop, uvi, clouds, dew_point } = data;
            
    return (
      <View style={styles.detailContainer}>
        <View style={styles.headerSection}>
          <Image 
            source={{ uri: getWeatherIcon(weather[0].icon) }}
            style={styles.weatherIcon}
          />
          <View>
            <Text style={styles.temperature}>{Math.round(temp)}°C</Text>
            <Text style={styles.feelsLike}>Feels like {Math.round(feels_like)}°C</Text>
            <Text style={styles.weatherDescription}>
              {weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{humidity}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cloud-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Cloud Cover</Text>
              <Text style={styles.detailValue}>{clouds}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{pressure} hPa</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="flash-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>UV Index</Text>
              <Text style={styles.detailValue}>{uvi.toFixed(1)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>{(visibility / 1000).toFixed(1)} km</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="water" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Dew Point</Text>
              <Text style={styles.detailValue}>{Math.round(dew_point)}°C</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="rainy-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Precipitation</Text>
              <Text style={styles.detailValue}>{Math.round(pop * 100)}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="navigate-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>{wind_speed.toFixed(1)} m/s</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderDailyDetail = () => {
    const { temp, feels_like, humidity, pressure, wind_speed,
            weather, pop, uvi, clouds, sunrise, sunset, 
            moonrise, moonset, summary } = data;

    // Chart data for temperature throughout the day
    const chartData = [
      { name: 'Morning', temp: temp.morn },
      { name: 'Day', temp: temp.day },
      { name: 'Evening', temp: temp.eve },
      { name: 'Night', temp: temp.night },
    ];
            
    return (
      <View style={styles.detailContainer}>
        <View style={styles.headerSection}>
          <Image 
            source={{ uri: getWeatherIcon(weather[0].icon) }}
            style={styles.weatherIcon}
          />
          <View>
            <Text style={styles.dateText}>{formatDate(data.dt)}</Text>
            <Text style={styles.weatherDescription}>
              {weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}
            </Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        </View>

        <View style={styles.tempRangeContainer}>
          <View style={styles.tempItem}>
            <Ionicons name="thermometer-outline" size={22} color="#ff6b6b" />
            <Text style={[styles.tempValue, styles.highTemp]}>
              {Math.round(temp.max)}°C
            </Text>
            <Text style={styles.tempLabel}>High</Text>
          </View>
          
          <View style={styles.tempItem}>
            <Ionicons name="thermometer-outline" size={22} color="#4dabf5" />
            <Text style={[styles.tempValue, styles.lowTemp]}>
              {Math.round(temp.min)}°C
            </Text>
            <Text style={styles.tempLabel}>Low</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Temperature Throughout Day</Text>
          
          <View style={styles.tempChartContainer}>
            {/* Temperature chart visualization - simplified for this example */}
            <View style={styles.tempChart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.tempChartBar}>
                  <Text style={styles.tempChartValue}>{Math.round(item.temp)}°</Text>
                  <View 
                    style={[
                      styles.tempBar, 
                      { height: Math.max(30, (item.temp - 5) * 3) }
                    ]}
                  />
                  <Text style={styles.tempChartLabel}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Sun & Moon</Text>
          
          <View style={styles.celestialContainer}>
            <View style={styles.celestialItem}>
              <Ionicons name="sunny-outline" size={28} color="#ff9e40" />
              <Text style={styles.celestialLabel}>Sunrise</Text>
              <Text style={styles.celestialValue}>{formatTime(sunrise)}</Text>
            </View>
            
            <View style={styles.celestialItem}>
              <Ionicons name="moon-outline" size={28} color="#6c757d" />
              <Text style={styles.celestialLabel}>Moonrise</Text>
              <Text style={styles.celestialValue}>{formatTime(moonrise)}</Text>
            </View>
            
            <View style={styles.celestialItem}>
              <Ionicons name="sunny-outline" size={28} color="#6c757d" />
              <Text style={styles.celestialLabel}>Sunset</Text>
              <Text style={styles.celestialValue}>{formatTime(sunset)}</Text>
            </View>
            
            <View style={styles.celestialItem}>
              <Ionicons name="moon-outline" size={28} color="#343a40" />
              <Text style={styles.celestialLabel}>Moonset</Text>
              <Text style={styles.celestialValue}>{formatTime(moonset)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{humidity}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="cloud-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Cloud Cover</Text>
              <Text style={styles.detailValue}>{clouds}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{pressure} hPa</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="flash-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>UV Index</Text>
              <Text style={styles.detailValue}>{uvi.toFixed(1)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="rainy-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Precipitation</Text>
              <Text style={styles.detailValue}>{Math.round(pop * 100)}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="navigate-outline" size={24} color="#0080ff" />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>{wind_speed.toFixed(1)} m/s</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {type === 'hourly' ? renderHourlyDetail() : renderDailyDetail()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  detailContainer: {
    padding: 15,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  feelsLike: {
    fontSize: 16,
    color: '#666',
  },
  weatherDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginTop: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    maxWidth: Dimensions.get('window').width - 130,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  tempRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tempItem: {
    alignItems: 'center',
  },
  tempValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  highTemp: {
    color: '#ff6b6b',
  },
  lowTemp: {
    color: '#4dabf5',
  },
  tempLabel: {
    fontSize: 14,
    color: '#666',
  },
  tempChartContainer: {
    height: 150,
    marginVertical: 10,
  },
  tempChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  tempChartBar: {
    alignItems: 'center',
    width: 50,
  },
  tempChartValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  tempBar: {
    width: 20,
    backgroundColor: '#0080ff',
    borderRadius: 5,
  },
  tempChartLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  celestialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  celestialItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  celestialLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  celestialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
});

export default WeatherDetailScreen;