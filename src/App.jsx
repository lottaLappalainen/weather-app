import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/navbar';
import Today from './pages/Today';
import Hourly from './pages/Hourly';
import Daily from './pages/Daily';
import Favorites from './pages/Favorites';
import Homepage from './pages/Homepage';
import { fetchGeocode, fetchTimeZone } from './services/weatherService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [cityName, setCityName] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('metric');
  const [timeZone, setTimeZone] = useState(null); 

  const handleSearch = async (city) => {
    if (!city.trim()) return; // Avoid empty searches
    try {
      const { lat, lon, name } = await fetchGeocode(city.trim());
      setCoordinates({ latitude: lat, longitude: lon });
      setCityName(name.charAt(0).toUpperCase() + name.slice(1));
      setRecentSearches(prev => {
        const newSearches = [name, ...prev.filter(item => item.toLowerCase() !== name.toLowerCase())];
        return newSearches.slice(0, 5); // Limit to the latest 5 searches
      });
      setSearchQuery(''); // Clear the search input
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchQuery); // Use the new unified search function
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFavorite = (city) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(city)) {
        return prevFavorites.filter(favorite => favorite !== city);
      } else {
        return [...prevFavorites, city];
      }
    });
  };

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  useEffect(() => {
    const fetchTimeZoneData = async () => {
      if (coordinates.latitude && coordinates.longitude) {
        try {
          const timeZoneData = await fetchTimeZone(coordinates.latitude, coordinates.longitude);
          setTimeZone(timeZoneData); 
        } catch (error) {
          console.error('Error fetching timezone data:', error);
        }
      }
    };

    fetchTimeZoneData();
  }, [coordinates]); 

  return (
    <Router>
      <div className="App">
        <NavbarWithCondition
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          setCoordinates={setCoordinates}
          setCityName={setCityName}
          cityName={cityName}
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          unit={unit}
          toggleUnit={toggleUnit}
        />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/today" element={<Today coordinates={coordinates} unit={unit} timeZone={timeZone} />} />
          <Route path="/hourly" element={<Hourly coordinates={coordinates} unit={unit} timeZone={timeZone} />} />
          <Route path="/daily" element={<Daily coordinates={coordinates} unit={unit} timeZone={timeZone} />} />
          <Route path="/favorites" element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} unit={unit} />} />
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
