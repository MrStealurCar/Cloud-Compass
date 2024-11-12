import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import WeatherInfo from "../WeatherInfo/WeatherInfo";

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
  useEffect(() => {
    if (!location) return;
    const fetchWeatherData = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      setError("");
      const { lat, lon } = coordinates;

      try {
        // Fetch request for current weather
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
        );
        const data = await response.json();
        if (data.cod === "404") {
          setError("City not found, please enter a different city");
          setWeatherData(null);
          return;
        } else {
          setWeatherData(data);
        }

        // Fetch request for forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
        );
        const forecastData = await forecastResponse.json();
        console.log(forecastData);
        if (forecastData.cod === "404") {
          throw new Error("Forecast data not available for this city");
        }

        // Process the forecast data to get the next 3 days
        const filteredForecast = filterForecastData(forecastData.list);
        setForecastData(filteredForecast);
      } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
        setError("Error fetching forecast data.");
      }
    };

    fetchWeatherData();
  }, [location, coordinates]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      console.log();
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();
        if (data.length > 0) {
          // Update coordinates state with the result
          setCoordinates({ lat: data[0].lat, lon: data[0].lon });
        } else {
          setError("City not found, please enter a different city");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Error retrieving location data.");
      }
    };
    fetchCoordinates();
  }, [location]);

  const filterForecastData = (forecastList) => {
    const today = new Date();
    const nextThreeDays = [];

    // Create a Set to keep track of unique dates
    const uniqueDates = new Set();

    for (let i = 0; i < forecastList.length; i++) {
      const forecast = forecastList[i];
      const forecastDate = new Date(forecast.dt * 1000); // Convert Unix timestamp to date

      // Check if the date is within the next three days
      if (
        uniqueDates.size < 3 &&
        forecastDate.getDate() > today.getDate() &&
        !uniqueDates.has(forecastDate.toDateString())
      ) {
        uniqueDates.add(forecastDate.toDateString());
        nextThreeDays.push({
          date: forecastDate.toDateString(),
          icon: forecast.weather[0].icon,
          temp: forecast.main.temp_max, // Store the max temperature for the day
        });
      }
    }

    return nextThreeDays;
  };

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
