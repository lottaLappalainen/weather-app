import React, { useState } from 'react';
import './Daily.css';
import arrowDown from '../assets/arrowDown.png'; 
import arrowUp from '../assets/arrowUp.png'; 
import sunsetIcon from '../assets/sunset.png';
import sunriseIcon from '../assets/sunrise.png';

const Daily = ({ dailyForecast, unit, timeZone }) => {
  const [expanded, setExpanded] = useState(Array(dailyForecast?.list?.length || 0).fill(false));

  const toggleExpanded = (index) => {
    setExpanded((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const formatTime = (unixTimestamp) => {
    return new Date((unixTimestamp + timeZone.gmtOffset - 10800) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <section id="Paivaa" className="paivaa-container">
      {dailyForecast?.list && dailyForecast.list.length > 0 ? (
        dailyForecast.list.map((day, index) => {
          const date = new Date((day.dt + timeZone.gmtOffset - 14400) * 1000).toLocaleDateString('fi-FI', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          });

          return (
            <div key={index} className="daily-weather">
              <div className="daily-weather-header">
                <h3>{date}</h3>
                <div className="temperature">
                  <span className="temp-value">{Math.round(day.temp.day)}</span>
                  <span className="temp-unit">{temperatureUnit}</span>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    className="weather-icon"
                  />
                  <img
                    src={expanded[index] ? arrowUp : arrowDown}
                    alt={expanded[index] ? 'Collapse' : 'Expand'}
                    className="toggle-arrow"
                    onClick={() => toggleExpanded(index)}
                  />
                </div>
              </div>
              <div className={`daily-weather-content ${expanded[index] ? 'expanded' : ''}`}>
                <div className="weather-details-row">
                  <div className="weather-detail">
                    <p><span className="detail-label">Korkein:</span><span className="detail-value">{Math.round(day.temp.max)}{temperatureUnit}</span></p>
                    <p><span className="detail-label">Alhaisin:</span><span className="detail-value">{Math.round(day.temp.min)}{temperatureUnit}</span></p>
                    <p><span className="detail-label">Tuuli:</span><span className="detail-value">{(day.speed)} {windSpeedUnit}</span></p>
                    <p><span className="detail-label">Kosteus:</span><span className="detail-value">{day.humidity}%</span></p>
                    <p><span className="detail-label">Pilvisyys:</span><span className="detail-value">{day.clouds}%</span></p>
                    <p><span className="detail-label">Sade:</span><span className="detail-value">{day.rain ? `${day.rain} mm` : '0.00 mm'}</span></p>
                  </div>
                  <div className="sun-times">
                    <p><img src={sunriseIcon} alt="sunrise icon" className="sun-icon" /> Auringonnousu: <span className="sunrise-time">{formatTime(day.sunrise)}</span></p>
                    <p><img src={sunsetIcon} alt="sunset icon" className="sun-icon" /> Auringonlasku: <span className="sunset-time">{formatTime(day.sunset)}</span></p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-forecast-message">Hae kaupunkia</div>
      )}
    </section>
  );
};

export default Daily;
