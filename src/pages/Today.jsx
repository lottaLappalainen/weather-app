import React, { useEffect, useState } from 'react';
import './Today.css';
import sunsetIcon from '../assets/sunset.png';
import sunriseIcon from '../assets/sunrise.png';
import { fetchCurrentForecast, fetchDailyForecast } from '../services/weatherService';

const Today = ({ coordinates, unit, timeZone }) => {

  const [currentForecast, setCurrentForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const { latitude, longitude } = coordinates;
        const currentData = await fetchCurrentForecast(latitude, longitude, unit);
        const dailyData = await fetchDailyForecast(latitude, longitude, unit);
        setCurrentForecast(currentData);
        setDailyForecast(dailyData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates, unit]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentForecast || !dailyForecast || !timeZone) {
    return <div className="no-forecast-message">Hae kaupunkia</div>;
  }

  const formatTime = (unixTimestamp) => {
    const offsetUnixTimestamp = unixTimestamp + timeZone.gmtOffset - 10800;
    return new Date(offsetUnixTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentDate = new Date((Date.now() + timeZone.gmtOffset * 1000) - 10800 * 1000);
  const currentFormattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentFormattedDate = currentDate.toLocaleDateString([], { day: 'numeric', month: 'long' });
  const todayWeather = dailyForecast.list[0];
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <section id="Tänään" className="tanaan-container">
      <div className="current-weather">
        <div className="current-weather-header">
          <h2>Tällä hetkellä</h2>
          <div className="today-date">{currentFormattedTime}</div>
        </div>
        <div className="c-weather-content">
          <div className="current-weather-main">
            <img src={`http://openweathermap.org/img/wn/${currentForecast.weather[0].icon}@2x.png`} 
                 alt="weather icon" 
                 className="weather-icon" />
            <div className="temperature">
              <span className="temp-value">{Math.round(currentForecast.main.temp)}</span>
              <span className="temp-unit">{temperatureUnit}</span>
            </div>
          </div>
          <div>
            <p>Pilvisyys: <span className="detail-value">{currentForecast.clouds.all}%</span></p>
            <p>Kosteus: <span className="detail-value">{currentForecast.main.humidity}%</span></p>
          </div>
          <div>
            <p>Tuuli: <span className="detail-value">{(currentForecast.wind.speed)} {windSpeedUnit}</span></p>
            <p>Sade: <span className="detail-value">{currentForecast.rain ? `${currentForecast.rain['1h']}` : '0.00'} mm</span></p>
          </div>
        </div>
      </div>

      <div className="today-weather">
        <div className="today-weather-header">
          <h2>Tänään</h2>
          <div className="today-date">{currentFormattedDate}</div>
        </div>
        <div className="today-weather-content">
          <div className="temp-and-icon">
            <img src={`http://openweathermap.org/img/wn/${todayWeather.weather[0].icon}@2x.png`}
                 alt="weather icon"
                 className="weather-icon" />
            <div>
              <p>Korkein: <span className="temp-high">{Math.round(todayWeather.temp.max)}{temperatureUnit}</span> / <span className="feels-like-high">{Math.round(todayWeather.feels_like.day)}{temperatureUnit}</span></p>
              <p>Alhaisin: <span className="temp-low">{Math.round(todayWeather.temp.min)}{temperatureUnit}</span> / <span className="feels-like-low">{Math.round(todayWeather.feels_like.night)}{temperatureUnit}</span></p>
            </div>
          </div>
          <div className="d-temp">
            <p>Aamu: <span className="temp-morning">{Math.round(todayWeather.temp.morn)}{temperatureUnit}</span> / <span className="feels-like-morning">{Math.round(todayWeather.feels_like.morn)}{temperatureUnit}</span></p>
            <p>Ilta: <span className="temp-evening">{Math.round(todayWeather.temp.eve)}{temperatureUnit}</span> / <span className="feels-like-evening">{Math.round(todayWeather.feels_like.eve)}{temperatureUnit}</span></p>
            <p>Yö: <span className="temp-night">{Math.round(todayWeather.temp.night)}{temperatureUnit}</span> / <span className="feels-like-night">{Math.round(todayWeather.feels_like.night)}{temperatureUnit}</span></p>
          </div>
          <div className="sun-times">
            <p><img src={sunriseIcon} alt="sunrise icon" className="sun-icon" /> Auringonnousu: <span className="sunrise-time">{formatTime(todayWeather.sunrise)}</span></p>
            <p><img src={sunsetIcon} alt="sunset icon" className="sun-icon" /> Auringonlasku: <span className="sunset-time">{formatTime(todayWeather.sunset)}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Today;
