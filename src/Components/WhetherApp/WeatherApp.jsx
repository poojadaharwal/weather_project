import React, { useState, useEffect } from "react";
import "./weatherApp.css";
import search_icon from "../../assets/search.png";
import clear_icon from "../../assets/clear.png";
import cloud_icon from "../../assets/cloud.png";
import drizzle_icon from "../../assets/drizzle.png";
import rain_icon from "../../assets/rain.png";
import snow_icon from "../../assets/snow.png";
import wind_icon from "../../assets/wind.png";
import humidity_icon from "../../assets/humidity.png";

const weatherIcons = {
  Snow: snow_icon,
  Clouds: cloud_icon,
  Clear: clear_icon,
  Drizzle: drizzle_icon,
  Rain: rain_icon,
  Thunderstorm: cloud_icon,
  Default: clear_icon,
};

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const getcurrentLocationData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
            import.meta.env.VITE_API_KEY
          }`
        )
          .then((res) => res.json())
          .then((data) => {
            setWeatherData(data);
          });
      });
    }
  };

  useEffect(() => {
    getcurrentLocationData();
  }, []);

  const handleChange = (e) => {
    setCity(e.target.value);
  };
  const handleSearch = () => {
    console.log({ city });
    console.log(import.meta.env.VITE_API_KEY);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
        import.meta.env.VITE_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setCity("");
      });
  };

  const toCelcius = (temp) => {
    return parseInt(temp - 273.15);
  };

  const getLocalTime = (time) => {
    return new Date(time * 1000).toLocaleTimeString().slice(0, 5);
  };

  const { name, weather, main, wind, sys } = weatherData || {};
  const { temp, humidity, feels_like, temp_min, temp_max } = main || {};
  const { speed } = wind || {};
  const { country, sunset, sunrise } = sys || {};
  const { main: weatherType } = weather?.[0] || {};

  const temperature = toCelcius(temp);
  const feelsLikeTemp = toCelcius(feels_like);
  const minTemp = toCelcius(temp_min);
  const maxTemp = toCelcius(temp_max);

  const windSpeed = parseInt((speed * 3600) / 1000);

  const weatherIcon = weatherIcons[weatherType] || weatherIcons.Default;
  const sunriseTime = getLocalTime(sunrise);
  const sunsetTime = getLocalTime(sunset);

  console.log({ name, weather, main, wind, weatherType, temperature });
  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter City Name"
          onChange={handleChange}
        />
        <div className="search-icon" onClick={handleSearch}>
          <img src={search_icon} alt="" />
        </div>
      </div>
      <div className="weather-image-container">
        <img src={weatherIcon} alt="" />
      </div>
      <div className="weather-temp">
        <span className="main-temp">
          {" "}
          {temperature ? `${temperature}°c` : "...Loading"}
        </span>
        <span className="weather-temp-feel">
          (Feels like {feelsLikeTemp}°c)
        </span>
        <span className="weather-var">
          L:{minTemp}°c {"  "} H:{maxTemp}°c
        </span>
      </div>
      <div className="weather-location">
        {name}, {country}
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon" />
          <div className="data">
            <div className="values">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon" />
          <div className="data">
            <div className="values">{windSpeed} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
      {sunrise && (
        <div className="weather-timimg">
          <p>
            Sunrise <br />
            {sunriseTime}
          </p>
          <p>
            Sunset <br />
            {sunsetTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
