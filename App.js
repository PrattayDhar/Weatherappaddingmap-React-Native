import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const API_KEY = '733dea94c83c3de998ac9a86462b6539';
const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const mapRef = useRef(null);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data not available for the selected location.');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error.message);
      setWeatherData(null);
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    mapRef.current.animateToRegion({
      ...coordinate,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    fetchWeatherData(coordinate.latitude, coordinate.longitude);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Image
            source={{
              uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
            }}
            style={styles.weatherIcon}
          />
          <Text style={styles.weatherText}>{weatherData.weather[0].description}</Text>
          <Text style={styles.temperature}>{`${weatherData.main.temp}°C`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherText: {
    fontSize: 18,
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WeatherApp;
