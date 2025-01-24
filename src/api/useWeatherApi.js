import { useEffect } from "react";
const API_KEY = process.env.REACT_APP_API_KEY;
function useWeatherApi({
  location,
  weatherData,
  setWeatherData,
  forecastData,
  setForecastData,
  error,
  setError,
  coordinates,
  setCoordinates,
  suggestedCity,
  showSuggestions,
  setShowSuggestions,
}) {
  useEffect(() => {
    if (!location) setError("Please enter a city.");
    const fetchCoordinates = async () => {
      try {
        const coordinateResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
        );
        const coordinateData = await coordinateResponse.json();
        if (coordinateData.length > 0) {
          const { lat, lon } = coordinateData[0];
          if (!lat || !lon) return;
          setCoordinates({ lat, lon }); // Set the coordinates
          console.log(`New coordinates set: ${lat}, ${lon}`);
          setShowSuggestions(false);
        } else {
          console.error("Invalid coordinates");
          setCoordinates(null);
          setWeatherData(null);
          setForecastData([]);
        }
      } catch (error) {
        setWeatherData(null);
        setForecastData([]);
      }
    };

    fetchCoordinates();
  }, [
    location,
    setCoordinates,
    setError,
    setForecastData,
    setShowSuggestions,
    setWeatherData,
  ]);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`
        );
        const weatherData = await weatherResponse.json();
        if (weatherData.cod === 404) {
          setCoordinates(null);
          setWeatherData(null);
          setForecastData([]);
          return;
        } else if (weatherData.cod === 200) {
          setError("");
          setWeatherData(weatherData);
        }

        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`
        );
        const forecastData = await forecastResponse.json();
        if (forecastData.cod === 404) {
          setCoordinates(null);
          setWeatherData(null);
          setForecastData([]);
          return;
        }

        const filterForecastData = (forecastList) => {
          const dailyTemps = {};

          forecastList.forEach((forecast) => {
            const date = new Date(forecast.dt * 1000).toDateString(); // For each forecast in the forecastList, convert timestamp (dt) to a JavaScript Date object and format it as a date string.

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
          if (coordinates.lat && coordinates.lon) {
            return nextThreeDays;
          } else {
            setCoordinates(null);
            setForecastData([]);
          }
        };

        const filteredForecast = filterForecastData(forecastData.list);
        if (filteredForecast) {
          setForecastData(filteredForecast);
        }
      } catch (error) {
        setError("City not found, please enter a different city.");
        setCoordinates(null);
        setWeatherData(null);
        setForecastData([]);
      }
    };

    fetchWeather();
  }, [
    coordinates,
    location,
    setCoordinates,
    setError,
    setForecastData,
    setWeatherData,
  ]);

  return {
    coordinates,
    weatherData,
    forecastData,
    error,
    suggestedCity,
    showSuggestions,
  };
}

export default useWeatherApi;
