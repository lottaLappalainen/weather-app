import React, { useEffect, useState } from 'react';
import './Hourly.css';
import { fetchHourlyForecast } from '../services/weatherService';

const Hourly = ({ coordinates, unit, timeZone }) => {
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const { latitude, longitude } = coordinates;
        const hourlyData = await fetchHourlyForecast(latitude, longitude, unit);
        setHourlyForecast(hourlyData);
      } catch (error) {
        console.error('Error fetching hourly forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates, unit]);

  const isTomorrowHeaderNeeded = (timestamp) => {
    if (!timeZone || !timeZone.gmtOffset) return false;
    const hour = new Date((timestamp + timeZone.gmtOffset - 14400) * 1000).getUTCHours();
    return hour < 22 && hour > 20;
  };

  const formatDate = (unixTimestamp) => {
    if (!timeZone || !timeZone.gmtOffset) return '';
    const date = new Date((unixTimestamp + timeZone.gmtOffset - 14400) * 1000);
    const weekdays = ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'launtai'];
    const months = ['tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'];

    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${weekday} ${day}. ${month}`;
  };

  const currentDate = new Date((Date.now() + (timeZone?.gmtOffset || 0) * 1000 - 10800 * 1000)).toLocaleDateString('fi-FI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <section id="Tänään" className="tunneittain-container">
      {loading ? (
        <div className="loading-message">Ladataan säätietoja...</div>
      ) : ( 
        hourlyForecast && hourlyForecast.list && hourlyForecast.list.length > 0 ? (
          <div className="hourly-weather">
            <div className="hourly-weather-header">
              <p>Aika</p>
              <p>Kuvaus</p>
              <p>Lämpötila</p>
              <p>Tuuli</p>
              <p>Pilvisyys</p>
              <p>Sade</p>
            </div>
            <div className="date">
              <p>Tänään</p>
              <p>{currentDate}</p>
            </div>
            <div className="hourly-weather-content">
              {hourlyForecast.list.slice(0, 25).map((hour, index) => (
                <React.Fragment key={index}>
                  {isTomorrowHeaderNeeded(hour.dt) && (
                    <div className="date">
                      <p>Huomenna</p>
                      <p>{formatDate(hour.dt)}</p>
                    </div>
                  )}
                  <div className="hourly-weather-row">
                    <p>{new Date((hour.dt + timeZone.gmtOffset - 14400) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                      alt={hour.weather[0].description}
                      className="hourly-icon"
                    />
                    <p>{Math.round(hour.main.temp)} {temperatureUnit}</p>
                    <p>{(hour.wind.speed)} {windSpeedUnit}</p>
                    <p>{hour.clouds.all} %</p>
                    <p>{hour.rain ? `${hour.rain['1h']} mm` : '0.00 mm'}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="loading-message">Hae kaupunkia</div>
        )
      )}
    </section>
  );
};

export default Hourly;
