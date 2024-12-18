import React from "react";
import "./SearchBar.css";
function SearchBar({ query, handleInputChange, handleSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter a city"
        className="search-bar"
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
