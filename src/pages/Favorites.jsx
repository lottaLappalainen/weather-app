import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import { fetchGeocode, fetchCurrentForecast, fetchHourlyForecast, fetchDailyForecast } from '../services/weatherService';

const Favorites = ({ favorites, setCoordinates, setCityName, setCurrentForecast, setHourlyForecast, setDailyForecast }) => {
  const navigate = useNavigate();

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
          favorites.map((city, index) => (
            <div key={index} className="favorite-item" onClick={() => handleCityClick(city)}>
              <div className="favorite-item-content">
                {city}
              </div>
            </div>
          ))
        ) : (
          <div className="no-favorites-message">No favorites</div> 
        )}
      </div>
    </section>
  );
};

export default Favorites;
