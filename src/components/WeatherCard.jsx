import React from "react";

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export default function WeatherCard({ current, location, loading }) {
  return (
    <div className="weather-card">
      <div className="card-top">
        <div className="location">
          <div className="loc-text">{location ? `${location.name}, ${location.country}` : "—"}</div>
          <div className="date">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
        </div>

        <div className="temp-block">
          <div className="weather-illustration">
            {current ? (
              <img src={iconUrl(current.icon)} alt={current.desc} />
            ) : (
              <div className="placeholder-illustration" />
            )}
          </div>
          <div className="temp-val">{current ? `${current.temp}°` : loading ? "..." : "--°"}</div>
        </div>
      </div>

      <div className="card-bottom">
        <p className="condition">{current ? current.desc : ""}</p>
      </div>
    </div>
  );
}
