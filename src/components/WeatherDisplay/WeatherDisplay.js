import React from "react";
import "./WeatherDisplay.css";
function WeatherDisplay({ weatherData, location }) {
  if (!weatherData) return;
  const city = location;
  const description = weatherData.weather[0].description;
  const icon = weatherData.weather[0].icon;
  const temperature = Math.round(weatherData.main.temp);

  return (
    <div className="weather-display">
      <h1 className="location">
        {city.charAt(0).toUpperCase() + city.slice(1)}
      </h1>
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
