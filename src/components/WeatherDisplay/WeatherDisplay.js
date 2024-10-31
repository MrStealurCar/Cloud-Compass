import React from "react";
import "./WeatherDisplay.css";
function WeatherDisplay({ weatherData, forecastData, location }) {
  if (!weatherData)
    return <p className="loading-message">Loading weather data...</p>;
  const description = weatherData.weather[0].description;
  const icon = weatherData.weather[0].icon;
  const temperature = Math.round((weatherData.main.temp * 9) / 5 + 32); // converts temp to Fahrenheit because AMERICA RAHHH

  return (
    <div className="weather-display">
      <h1 className="location">{location}</h1>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      <div>
        <h2>{temperature}°F</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default WeatherDisplay;
