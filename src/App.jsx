import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import HourlyList from "./components/HourlyList";
import DailyForecast from "./components/DailyForecast";

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;


export default function App() {
  const [query, setQuery] = useState("Berlin"); // default city to match template
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState([]); // next hours
  const [daily, setDaily] = useState([]); // daily summary
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchWeather(query);
    // eslint-disable-next-line
  }, []);

  async function fetchWeather(city) {
    if (!API_KEY) {
      setError("Missing OpenWeather API key. Add REACT_APP_OPENWEATHER_KEY in .env.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1) Geocoding: city -> lat/lon
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      const geo = await geoRes.json();
      if (!geo || geo.length === 0) {
        throw new Error("Location not found");
      }
      const { lat, lon, name, country } = geo[0];
      setLocation({ name, country });

      // 2) Current weather
      const nowRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const now = await nowRes.json();

      // 3) 5-day / 3-hour forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecast = await forecastRes.json();

      // Process hourly: next 8 entries (3-hour intervals) => show next ~24h
      const nextHours = (forecast.list || []).slice(0, 8).map((item) => ({
        dt: item.dt * 1000,
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        desc: item.weather[0].main,
      }));

      // Process daily: group by date (use first item of each day)
      const dayMap = {};
      (forecast.list || []).forEach((item) => {
        const d = new Date(item.dt * 1000);
        const dateKey = d.toISOString().slice(0, 10);
        if (!dayMap[dateKey]) {
          dayMap[dateKey] = { items: [] };
        }
        dayMap[dateKey].items.push(item);
      });

      const dailyArr = Object.keys(dayMap)
        .slice(0, 7)
        .map((date) => {
          const items = dayMap[date].items;
          // compute min/max temps for that date
          const temps = items.map((i) => i.main.temp);
          const min = Math.round(Math.min(...temps));
          const max = Math.round(Math.max(...temps));
          // pick an icon from midday-ish item or first item
          const midday = items[Math.floor(items.length / 2)];
          const icon = midday.weather[0].icon;
          const main = midday.weather[0].main;
          return {
            date,
            min,
            max,
            icon,
            main,
          };
        });

      setCurrent({
        temp: Math.round(now.main.temp),
        feels_like: Math.round(now.main.feels_like),
        humidity: now.main.humidity,
        wind: Math.round(now.wind.speed),
        desc: now.weather[0].main,
        icon: now.weather[0].icon,
      });

      setHourly(nextHours);
      setDaily(dailyArr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="sun-icon" aria-hidden />
            <span>Weather Now</span>
          </div>
          <div className="units">°C</div>
        </header>

        <main className="main">
          <h1 className="hero-title">How's the sky looking today?</h1>

          <SearchBar
            onSearch={(q) => {
              setQuery(q);
              fetchWeather(q);
            }}
            defaultValue={query}
          />

          {error && <div className="error">{error}</div>}

          <div className="content-grid">
            <div className="left-column">
              <WeatherCard current={current} location={location} loading={loading} />
              <div className="stats-row">
                <div className="stat">Feels Like <div className="stat-val">{current?.feels_like ?? "--"}°</div></div>
                <div className="stat">Humidity <div className="stat-val">{current?.humidity ?? "--"}%</div></div>
                <div className="stat">Wind <div className="stat-val">{current?.wind ?? "--"} km/h</div></div>
                <div className="stat">Precip <div className="stat-val">0 mm</div></div>
              </div>

              <h3 className="section-title">Daily forecast</h3>
              <DailyForecast daily={daily} />
            </div>

            <aside className="right-column">
              <div className="hourly-pane">
                <div className="hourly-header">
                  <span>Hourly forecast</span>
                  <select className="day-select">
                    <option>Today</option>
                    <option>Tomorrow</option>
                  </select>
                </div>
                <HourlyList hourly={hourly} />
              </div>
            </aside>
          </div>
        </main>
      </div>

      <footer className="page-bg" />
    </div>
  );
}

