import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
function App() {
  const [location, setLocation] = useState("Orlando");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!location) return;
    const fetchWeatherData = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      setError("");
      try {
        // fetch request for current weather
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod === "404") {
          setError("City not found, please enter a different city");
          setWeatherData(null);
          return;
        } else {
          setWeatherData(data);
        }

        // fetch request for forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();
        if (forecastData.cod === "404") {
          throw new Error("Forecast data not available for this city");
        }
        setForecastData(forecastData);
        setForecastData(forecastData.list.slice(0, 3)); // shows forecast for next 3 days
      } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
        setError("Error fetching weather data.");
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
      <main>
        <div className="search">
          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="weather-container">
          <WeatherDisplay
            location={location}
            weatherData={weatherData}
            forecastData={forecastData}
          />
        </div>
      </main>
    </div>
  );
}
export default App;
