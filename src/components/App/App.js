import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import WeatherInfo from "../WeatherInfo/WeatherInfo";
import SearchResults from "../SearchResults/SearchResults";
function App() {
  const [location, setLocation] = useState("Orlando");
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
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      setError("");
      setWeatherData(null);
      setForecastData([]);
      try {
        // Fetch coordinates
        const coordResponse = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${API_KEY}`
        );
        const coordData = await coordResponse.json();

        if (coordData.length === 0) {
          setError("City not found, please enter a different city");
          setWeatherData(null);
          return;
        }

        const { lat, lon } = coordData[0];
        setCoordinates({ lat, lon });

        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === "404") {
          setError("City not found, please enter a different city");
          setWeatherData(null);
          return;
        }
        setWeatherData(weatherData);

        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
        );
        const forecastData = await forecastResponse.json();

        const filteredForecast = filterForecastData(forecastData.list);
        setForecastData(filteredForecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Error retrieving weather data.");
        setWeatherData(null);
        setForecastData([]);
      }
    };

    fetchWeather();
  }, [location]);

  const fetchCitySuggestions = async (input) => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    if (input.length >= 3) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestedCity(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestedCity([]);
      setShowSuggestions(false);
    }
  };

  const filterForecastData = (forecastList) => {
    const dailyTemps = {};

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toDateString();

      if (!dailyTemps[date]) {
        dailyTemps[date] = { temps: [], icon: forecast.weather[0].icon };
      }
      dailyTemps[date].temps.push(forecast.main.temp_max);
    });

    const nextThreeDays = Object.entries(dailyTemps)
      .slice(1, 4)
      .map(([date, data]) => ({
        date,
        icon: data.icon,
        temp: Math.max(...data.temps),
      }));

    return nextThreeDays;
  };

  let handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    fetchCitySuggestions(input);
  };

  const handleCitySelect = (city) => {
    setLocation(`${city.name}, ${city.country}`);
    setCoordinates({ lat: city.lat, lon: city.lon });
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div className="search">
          <SearchBar
            onChange={fetchCitySuggestions}
            query={query}
            setQuery={setQuery}
            handleSearch={() => {
              setLocation(query);
              handleInputChange = { handleInputChange };
            }}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="weather-container">
          <WeatherDisplay location={location} weatherData={weatherData} />
        </div>
        <div className="forecast-container">
          <WeatherInfo forecastData={forecastData} />
        </div>

        <div>
          <SearchResults
            suggestions={suggestedCity}
            onCitySelect={handleCitySelect}
            visible={showSuggestions}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
