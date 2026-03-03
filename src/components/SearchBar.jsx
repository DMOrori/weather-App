import React, { useState } from "react";

export default function SearchBar({ onSearch, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        placeholder="Search for a place..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search city"
      />
      <button className="search-btn" type="submit">Search</button>
    </form>
  );
}
