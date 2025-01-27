import { useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

function useWeatherApi({
  location,
  setLocation,
  setWeatherData,
  setForecastData,
  setError,
  coordinates,
  setCoordinates,
  setShowSuggestions,
}) {
  useEffect(() => {
    // Reset state when location changes
    setWeatherData(null);
    setForecastData(null);

    if (!location) {
      setError("City not found, please enter a valid location.");
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();

        if (!data || data.length === 0) {
          setError("City not found. Please try again.");
          setCoordinates(null);
          return;
        }

        const { lat, lon } = data[0];
        if (lat && lon) {
          setCoordinates({ lat, lon });
          setError("");
          setShowSuggestions(false);
        } else {
          setError("Invalid coordinates received.");
          setCoordinates(null);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Failed to fetch location data. Please try again.");
        setCoordinates(null);
      }
    };

    fetchCoordinates();
  }, [
    location,
    setError,
    setCoordinates,
    setWeatherData,
    setForecastData,
    setShowSuggestions,
  ]);

  useEffect(() => {
    if (!coordinates || !coordinates.lat || !coordinates.lon) return;

    const fetchWeather = async () => {
      try {
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === 200) {
          setWeatherData(weatherData);
          setError("");
        } else {
          throw new Error("Weather data not found.");
        }

        // Fetch forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`
        );
        const forecastData = await forecastResponse.json();

        if (forecastData.cod === "200") {
          const filteredForecast = forecastData.list.reduce((acc, item) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!acc[date]) {
              acc[date] = {
                temps: [],
                icon: item.weather[0].icon,
              };
            }
            acc[date].temps.push(item.main.temp_max);
            return acc;
          }, {});

          const nextThreeDays = Object.entries(filteredForecast)
            .slice(1, 4) // Skip today, take the next 3 days
            .map(([date, data]) => ({
              date,
              temp: Math.max(...data.temps),
              icon: data.icon,
            }));

          setForecastData(nextThreeDays);
        } else {
          throw new Error("Forecast data not found.");
        }
      } catch (error) {
        console.error("Error fetching weather/forecast data:", error);
        setError("Failed to fetch weather data. Please try again.");
        setWeatherData(null);
        setForecastData(null);
      }
    };

    fetchWeather();
  }, [coordinates, setError, setWeatherData, setForecastData]);
}

export default useWeatherApi;
