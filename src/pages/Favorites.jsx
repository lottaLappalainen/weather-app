import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import { fetchGeocode, fetchCurrentForecast, fetchHourlyForecast, fetchDailyForecast } from '../services/weatherService';

const Favorites = ({ favorites, setCoordinates, setCityName, setCurrentForecast, setHourlyForecast, setDailyForecast }) => {
  const [weatherData, setWeatherData] = useState({});
  const navigate = useNavigate();

  // Fetch the current weather for all favorite cities
  useEffect(() => {
    const fetchWeatherForFavorites = async () => {
      const weatherInfo = {};

      for (const city of favorites) {
        try {
          const { lat, lon } = await fetchGeocode(city);
          const currentWeather = await fetchCurrentForecast(lat, lon, 'metric');
          weatherInfo[city] = currentWeather;
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
        }
      }

      setWeatherData(weatherInfo);
    };

    if (favorites.length > 0) {
      fetchWeatherForFavorites();
    }
  }, [favorites]);

  const handleCityClick = async (city) => {
    try {
      const { lat, lon, name } = await fetchGeocode(city);
      
      setCoordinates({ latitude: lat, longitude: lon });
      setCityName(name.charAt(0).toUpperCase() + name.slice(1));

      const currentData = await fetchCurrentForecast(lat, lon, 'metric');
      setCurrentForecast(currentData);

      const hourlyData = await fetchHourlyForecast(lat, lon, 'metric');
      setHourlyForecast(hourlyData);

      const dailyData = await fetchDailyForecast(lat, lon, 'metric');
      setDailyForecast(dailyData);

      navigate('/Tanaan');
    } catch (error) {
      console.error('Error fetching geocode or weather data:', error);
    }
  };

  return (
    <section id="suosikit-container" className="favorites-container">
      <div className="favorites-content">
        {favorites.length > 0 ? (
          favorites.map((city, index) => {
            const weather = weatherData[city];

            return (
              <div key={index} className="favorite-item" onClick={() => handleCityClick(city)}>
                <div className="favorite-item-content">
                  <span className="city-name">{city}</span>
                  {weather ? (
                    <div className="weather-info">
                      <span className="temp-value">{Math.round(weather.main.temp)}°C</span>
                    </div>
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-favorites-message">No favorites</div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
