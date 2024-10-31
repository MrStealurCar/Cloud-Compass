import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
function App() {
  const [location, setLocation] = useState("Orlando");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!location) return;
    const fetchWeatherData = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      try {
        // fetch request for current weather
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);

        // fetch request for forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData);
        setForecastData(forecastData.list.slice(0, 3)); // shows forecast for next 3 days
      } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
      }
    };

    fetchWeatherData();
  }, [location]);

  const handleSearch = () => {
    setLocation(query);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <body>
        <div className="search">
          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
        </div>
        <div className="weather-container">
          <WeatherDisplay
            location={location}
            weatherData={weatherData}
            forecastData={forecastData}
          />
        </div>
      </body>
    </div>
  );
}
export default App;
