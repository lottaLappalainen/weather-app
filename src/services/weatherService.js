import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const TIMEZONE_API_KEY = import.meta.env.VITE_TIMEZONE_API_KEY;

// Fetch city geocode based on city name
export const fetchGeocode = async (city) => {
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  const response = await axios.get(geocodeUrl);
  const data = response.data;

  if (data.length === 0) {
    throw new Error("City not found");
  }

  const { lat, lon, name } = data[0];
  return { lat, lon, name };
};

// Fetch current weather forecast
export const fetchCurrentForecast = async (lat, lon, unit) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  const response = await axios.get(url);
  return response.data;
};

// Fetch hourly forecast
export const fetchHourlyForecast = async (lat, lon, unit) => {
  const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
  const response = await axios.get(url);
  return response.data;
};

// Fetch daily forecast
export const fetchDailyForecast = async (lat, lon, unit) => {
  const url = `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=10&appid=${API_KEY}&units=${unit}`;
  const response = await axios.get(url);
  return response.data;
};

// Fetch timezone information
export const fetchTimeZone = async (lat, lon) => {
  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;
  const response = await axios.get(url);
  return response.data;
};
