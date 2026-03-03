import React from "react";

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}.png`;
}

function formatHour(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString([], { hour: "numeric", hour12: true });
}

export default function HourlyList({ hourly = [] }) {
  if (!hourly || hourly.length === 0) {
    return <div className="hourly-empty">No hourly data</div>;
  }

  return (
    <div className="hourly-list">
      {hourly.map((h, idx) => (
        <div className="hour-row" key={idx}>
          <div className="hour-time">{formatHour(h.dt)}</div>
          <div className="hour-icon"><img alt={h.desc} src={iconUrl(h.icon)} /></div>
          <div className="hour-temp">{h.temp}°</div>
        </div>
      ))}
    </div>
  );
}
