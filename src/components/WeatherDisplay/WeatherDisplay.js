import React from "react";
import "./WeatherDisplay.css";
function WeatherDisplay({ weatherData, location }) {
  if (!weatherData) return;
  const description = weatherData.weather[0].description;
  const icon = weatherData.weather[0].icon;
  const temperature = Math.round(weatherData.main.temp);

  return (
    <div className="weather-display">
      <h1 className="location">{location}</h1>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      <div>
        <h2>{temperature}°F</h2>
        <p className="description">
          {description.charAt(0).toUpperCase() + description.slice(1)}
        </p>
      </div>
    </div>
  );
}

export default WeatherDisplay;
