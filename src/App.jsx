import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/navbar';
import Today from './pages/Today';
import Hourly from './pages/Hourly';
import Daily from './pages/Daily';
import Favorites from './pages/Favorites';
import Homepage from './pages/Homepage';
import { 
  fetchCurrentForecast, 
  fetchHourlyForecast, 
  fetchDailyForecast, 
  fetchTimeZone,
  fetchGeocode 
} from './services/weatherService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [currentForecast, setCurrentForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [cityName, setCityName] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric');
  const [timeZone, setTimeZone] = useState('');

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      fetchWeatherData(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates, unit]);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const [currentData, hourlyData, dailyData, timeZoneData] = await Promise.all([
        fetchCurrentForecast(lat, lon, unit),
        fetchHourlyForecast(lat, lon, unit),
        fetchDailyForecast(lat, lon, unit),
        fetchTimeZone(lat, lon),
      ]);

      setCurrentForecast(currentData);
      setHourlyForecast(hourlyData);
      setDailyForecast(dailyData);
      setTimeZone(timeZoneData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const resetSearchQuery = () => {
    setSearchQuery('');
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const { lat, lon, name } = await fetchGeocode(searchQuery);
      setCoordinates({ latitude: lat, longitude: lon });
      setCityName(name.charAt(0).toUpperCase() + name.slice(1));
      fetchWeatherData(lat, lon);
      setRecentSearches((prev) => {
        const newSearches = [name, ...prev.filter((item) => item.toLowerCase() !== name.toLowerCase())];
        return newSearches.slice(0, 5);
      });
      resetSearchQuery();
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFavorite = (city) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(city)) {
        return prevFavorites.filter((favorite) => favorite !== city);
      } else {
        return [...prevFavorites, city];
      }
    });
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <Router>
      <div className="App">
        <NavbarWithCondition
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          setCoordinates={setCoordinates}
          cityName={cityName}
          setCityName={setCityName}
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          unit={unit}
          toggleUnit={toggleUnit}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                handleSearchSubmit={handleSearchSubmit}
                handleSearchChange={handleSearchChange}
                searchQuery={searchQuery}
                setCoordinates={setCoordinates}
                setCityName={setCityName}
                recentSearches={recentSearches}
                setRecentSearches={setRecentSearches}
              />
            }
          />
          <Route
            path="/Tanaan"
            element={
              <Today
                currentForecast={currentForecast}
                dailyForecast={dailyForecast}
                unit={unit}
                timeZone={timeZone} 
              />
            }
          />
          <Route
            path="/Tunneittain"
            element={
              <Hourly
                hourlyForecast={hourlyForecast}
                unit={unit}
                timeZone={timeZone} 
              />
            }
          />
          <Route
            path="/10_paivaa"
            element={
              <Daily
                dailyForecast={dailyForecast}
                unit={unit}
                timeZone={timeZone} 
              />
            }
          />
          <Route
            path="/Suosikit"
            element={
              <Favorites
                favorites={favorites}
                setCoordinates={setCoordinates}
                setCityName={setCityName}
                setCurrentForecast={setCurrentForecast}
                setHourlyForecast={setHourlyForecast}
                setDailyForecast={setDailyForecast}
                unit={unit}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function NavbarWithCondition(props) {
  const location = useLocation();
  if (location.pathname === '/') {
    return null;
  }
  return <MyNavbar {...props} />;
}

export default App;
