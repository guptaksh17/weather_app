import './App.css';
import {Search} from './components/search/search';
import { Forecast } from './components/forecast/forecast';
import { CurrentWeather } from './components/search/current-weather/current-weather';
import { WEATHER_API_URL } from './api';
import { WEATHER_API_KEY } from './api';
import { useState, useEffect } from 'react';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Load search history from local storage when the app mounts
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);
  }, []);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        // Save to state
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });

        // Update search history
        const updatedHistory = [...new Set([...searchHistory, searchData.label])]; // Avoid duplicates
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory)); // Save to local storage
      })
      .catch((err) => console.log(err));
  };

  const toggleUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9 / 5) + 32; // Convert to Fahrenheit
  };

  const handleHistoryClick = (city) => {
    // Here you can implement the functionality to fetch weather data again for the clicked city
    // For simplicity, we will simulate this
    // This would typically involve finding the latitude and longitude for the city
    // and then calling handleOnSearchChange
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />

      {/* Toggle switch */}
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isCelsius}
            onChange={toggleUnit}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">
          {isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
        </span>
      </div>

      {/* Display current weather and forecast */}
      {currentWeather && (
        <CurrentWeather data={{ ...currentWeather, isCelsius, temp: convertTemperature(currentWeather.main.temp) }} />
      )}
      {forecast && (
        <Forecast data={{ 
          ...forecast, 
          list: forecast.list.map(item => ({
            ...item,
            main: { ...item.main, temp: convertTemperature(item.main.temp) }
          })) 
        }} 
        isCelsius={isCelsius} 
        />
      )}

      {/* Display search history */}
      <div className="search-history">
        <h2>Previously Searched Cities</h2>
        <ul>
          {searchHistory.map((city, index) => (
            <li key={index} onClick={() => handleHistoryClick(city)} style={{ cursor: 'pointer' }}>
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
