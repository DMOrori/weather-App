import React from "react";

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}.png`;
}

export default function DailyForecast({ daily = [] }) {
  if (!daily || daily.length === 0) {
    return <div className="daily-empty">No forecast available</div>;
  }

  return (
    <div className="daily-row">
      {daily.map((d, idx) => {
        const dateObj = new Date(d.date);
        const dayShort = dateObj.toLocaleDateString(undefined, { weekday: "short" });
        return (
          <div className="daily-card" key={idx}>
            <div className="daily-day">{idx === 0 ? "Today" : dayShort}</div>
            <img src={iconUrl(d.icon)} alt={d.main} />
            <div className="daily-temps"><span className="max">{d.max}°</span> <span className="min">{d.min}°</span></div>
          </div>
        );
      })}
    </div>
  );
}
