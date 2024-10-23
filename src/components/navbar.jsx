import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import settingsIcon from '../assets/settings.png';
import heartIcon from '../assets/heart.png';
import filledHeartIcon from '../assets/heartFill.png';
import { fetchGeocode, fetchCurrentForecast, fetchHourlyForecast, fetchDailyForecast } from '../services/weatherService'; // Import the geocode and weather services

const MyNavbar = ({
  handleSearchSubmit,
  handleSearchChange,
  searchQuery,
  setCoordinates,
  cityName,
  setCityName,
  recentSearches,
  setRecentSearches,
  favorites,
  toggleFavorite,
  unit,
  toggleUnit,
}) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [filteredSearch, setFilteredSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname, location]);

  const handleSearchSubmitLocal = async (event) => {
    event.preventDefault();

    try {
      const { lat, lon, name } = await fetchGeocode(searchQuery); 

      setCoordinates({ latitude: lat, longitude: lon });
      setCityName(name.charAt(0).toUpperCase() + name.slice(1)); 

      const currentData = await fetchCurrentForecast(lat, lon, unit);
      const hourlyData = await fetchHourlyForecast(lat, lon, unit);
      const dailyData = await fetchDailyForecast(lat, lon, unit);

      handleSearchSubmit(currentData, hourlyData, dailyData);

      setRecentSearches((prev) => {
        const newSearches = [name, ...prev.filter((item) => item.toLowerCase() !== name.toLowerCase())];
        return newSearches.slice(0, 5);
      });
      handleSearchChange({ target: { value: '' } });
      navigate('/Tanaan');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  };

  const handleSearchChangeLocal = (event) => {
    handleSearchChange(event);
    const query = event.target.value;
    if (query.length > 0) {
      const filtered = recentSearches.filter((search) =>
        search.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSearch(filtered.length > 0 ? filtered[0] : '');
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleRecentSearchClick = (search) => {
    setShowDropdown(false);
    handleSearchSubmitLocal({ preventDefault: () => {} });
  };

  const handleHeartClick = () => {
    toggleFavorite(cityName);
  };

  const handleSettingsClick = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <div className="navbar">
      <form onSubmit={handleSearchSubmitLocal} className="search-form">
        <div className="search-bar-container">
          <div className="app-logo"><Link to="/">Sää Sovellus</Link></div>
          <img
            src={favorites.includes(cityName) ? filledHeartIcon : heartIcon}
            alt="heart icon"
            className="heart-icon"
            onClick={handleHeartClick}
          />
          <span className="city-name">{cityName}</span>
          <div className="autocomplete-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChangeLocal}
              placeholder="Hae..."
              className="search-input"
            />
            {showDropdown && filteredSearch && (
              <ul className="autocomplete-dropdown">
                <li onClick={() => handleRecentSearchClick(filteredSearch)}>
                  {filteredSearch}
                </li>
              </ul>
            )}
          </div>
          <button type="submit" className="search-button">Hae</button>
          <img src={settingsIcon} alt="settings icon" className="settings-icon" onClick={handleSettingsClick} />
        </div>
      </form>
      {showSettings && (
        <div className="settings-dropdown">
          <label>
            <input
              type="radio"
              value="metric"
              checked={unit === 'metric'}
              onChange={toggleUnit}
            />
            Celsius (°C)
          </label>
          <label>
            <input
              type="radio"
              value="imperial"
              checked={unit === 'imperial'}
              onChange={toggleUnit}
            />
            Fahrenheit (°F)
          </label>
        </div>
      )}
      <div className="nav-links">
        <Link to="/Tanaan" className={activeLink === '/Tanaan' ? 'active' : ''}>
          Tänään
        </Link>
        <Link to="/Tunneittain" className={activeLink === '/Tunneittain' ? 'active' : ''}>
          Tunneittain
        </Link>
        <Link to="/10_paivaa" className={activeLink === '/10_paivaa' ? 'active' : ''}>
          10 päivää
        </Link>
        <Link to="/Suosikit" className={activeLink === '/Suosikit' ? 'active' : ''}>
          Suosikit
        </Link>
      </div>
    </div>
  );
};

export default MyNavbar;
