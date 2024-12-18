import React from "react";
import "./WeatherInfo.css";

function WeatherInfo({ forecastData }) {
  if (!forecastData || forecastData.length === 0) return;

  return (
    <div className="weather-info">
      {forecastData.map((day, index) => (
        <div key={index} className="info">
          <h3>{day.date}</h3>
          <div>
            <img
              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt="weather icon"
            />
            <p>{Math.floor(day.temp)}°F</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeatherInfo;
