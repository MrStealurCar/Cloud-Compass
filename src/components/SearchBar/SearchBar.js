import React from "react";
import "./SearchBar.css";
function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter a city"
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
