import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import logo from '../assets/weather.png'; 
import { fetchGeocode } from '../services/weatherService'; 

const Homepage = ({ setCoordinates, setCityName, recentSearches, setRecentSearches }) => {  // Default value added here
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const performSearch = async (city) => {
    if (!city.trim()) return;
    try {
      const geocodeData = await fetchGeocode(city.trim());
      if (!geocodeData || geocodeData.length === 0) return;

      const { lat, lon, name } = geocodeData;

      setCoordinates({ latitude: lat, longitude: lon });
      setCityName(name.charAt(0).toUpperCase() + name.slice(1));
      setRecentSearches((prev) => {
        const newSearches = [name, ...prev.filter(item => item.toLowerCase() !== name.toLowerCase())];
        return newSearches.slice(0, 5);
      });

      navigate('/today'); 
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    performSearch(searchQuery);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value;
    if (query.length > 0) {
      const filtered = recentSearches.filter(search =>
        search.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSearches(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleRecentSearchClick = (city) => {
    performSearch(city);
  };

  return (
    <div className="homepage-container">
      <div className="homepage-logos">
        <img src={logo} alt="Logo" className="homepage-logo" />
        <div className="homepage-text">
          <div> Sää </div>
          <div> Sovellus </div>
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className="homepage-search-form">
        <div className="autocomplete-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Hae kaupunkia"
            className="homepage-search-input"
          />
          <button type="submit" className="homepage-search-button">Hae</button>
          {showDropdown && (
            <ul className="autocomplete-dropdown">
              {filteredSearches.map((search, index) => (
                <li key={index} onClick={() => handleRecentSearchClick(search)}>
                  {search}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
      {recentSearches && recentSearches.length > 0 && (
        <div className="recent-searches">
          <h2>Viimeisimmät haut:</h2>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index} onClick={() => handleRecentSearchClick(search)}>
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Homepage;
