import React, { useState } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import WeatherInfo from "../WeatherInfo/WeatherInfo";
import SearchResults from "../SearchResults/SearchResults";
import useWeatherApi from "../../api/useWeatherApi";
import { stateAbbreviations } from "../../stateAbbreviations";
function App() {
  const [location, setLocation] = useState("Orlando, FL, US");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 28.5383,
    lon: -81.3792,
  });
  const [suggestedCity, setSuggestedCity] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useWeatherApi({
    coordinates,
    location,
    setWeatherData,
    setForecastData,
    setQuery,
    setError,
    setCoordinates,
    setSuggestedCity,
    showSuggestions,
    setShowSuggestions,
  });

  const handleCitySelect = (city) => {
    let location = `${city.name}, ${city.country}`;

    if (city.state) {
      // Look up abbreviation for the state
      const stateAbbr = stateAbbreviations[city.state] || city.state;
      location = `${city.name}, ${stateAbbr}, ${city.country}`;
    }

    setQuery(location);
    setCoordinates({ lat: city.lat, lon: city.lon });
    setLocation(location);
    setShowSuggestions(false);
  };

  const handleInputChange = async (e) => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const input = e.target.value;
    setQuery(input);

    if (input.length >= 3) {
      try {
        const suggestionResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
        );
        const data = await suggestionResponse.json();
        if (data.length > 0) {
          setSuggestedCity(data);
          setShowSuggestions(true);
        } else {
          setSuggestedCity([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestedCity([]);
      setShowSuggestions(false);
    }
  };
  const handleClear = () => {
    setLocation("Orlando, FL, US");
    setCoordinates({
      lat: 28.5383,
      lon: -81.3792,
    });
    setQuery("");
    setShowSuggestions(false);
    setError("");
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div className="search">
          <SearchBar
            query={query}
            handleInputChange={handleInputChange}
            handleSearch={() =>
              query.length === 0
                ? setError("Please enter a city name")
                : setLocation(query)
            }
            handleClear={handleClear}
          />
          <SearchResults
            suggestions={suggestedCity}
            onCitySelect={handleCitySelect}
            visible={showSuggestions}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="weather-container">
          <WeatherDisplay location={location} weatherData={weatherData} />
        </div>
        <div className="forecast-container">
          <WeatherInfo forecastData={forecastData} />
        </div>
      </main>
    </div>
  );
}

export default App;
