import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [query, setQuery] = useState("");
  return (
    <div className="app">
      <header className="app-header"></header>
    </div>
  );
}

export default App;
