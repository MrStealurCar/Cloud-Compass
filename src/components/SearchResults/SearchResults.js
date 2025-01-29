import React from "react";
import "./SearchResults.css";
function SearchResults({ suggestions, onCitySelect, visible }) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="search-results">
      <ul>
        {suggestions.map((city, index) => (
          <p key={index} onClick={() => onCitySelect(city)} className="city">
            {city.name}, {city.state || city.country}
          </p>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
