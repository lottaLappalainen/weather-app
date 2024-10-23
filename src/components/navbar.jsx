import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import settingsIcon from '../assets/settings.png';
import heartIcon from '../assets/heart.png';
import filledHeartIcon from '../assets/heartFill.png';

  const MyNavbar = ({
    handleSearchSubmit,
    handleSearchChange,
    searchQuery,
    setSearchQuery,
    cityName,
    recentSearches,
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
  }, [location.pathname]);

  const handleRecentSearchClick = (search) => {
    console.log("search", search)
    setSearchQuery(search); // Set the search query to the clicked recent search
    handleSearchSubmit({ preventDefault: () => {} }, search); // Simulate form submission
    setShowDropdown(false);
    navigate('/today'); 
  };

  const handleHeartClick = () => {
    if (cityName && cityName.trim() !== '') {
      toggleFavorite(cityName);
    }
  };

  const handleSettingsClick = () => {
    setShowSettings((prev) => !prev);
  };

  const handleSearchChangeLocal = (event) => {
    handleSearchChange(event);
    const value = event.target.value;
    const filtered = recentSearches.filter((search) =>
      search.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSearch(filtered.length > 0 ? filtered[0] : ''); 
    setShowDropdown(value.length > 0 && filtered.length > 0);
  };

  return (
    <div className="navbar">
      <form onSubmit={handleSearchSubmit} className="search-form">
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
        <Link to="/today" className={activeLink === '/today' ? 'active' : ''}>
          Tänään
        </Link>
        <Link to="/hourly" className={activeLink === '/hourly' ? 'active' : ''}>
          Tunneittain
        </Link>
        <Link to="/daily" className={activeLink === '/daily' ? 'active' : ''}>
          10 päivää
        </Link>
        <Link to="/favorites" className={activeLink === '/favorites' ? 'active' : ''}>
          Suosikit
        </Link>
      </div>
    </div>
  );
};

export default MyNavbar;
