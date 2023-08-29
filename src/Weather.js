import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

export default function Weather() {
  let [first, setFirst] = useState(true);
  let [forecast, setForecast] = useState([{}]);
  let [city, setCity] = useState("");
  let [weatherInfo, setWeatherInfo] = useState({});
  let [update, setUpdate] = useState();
  function formatDate(timespan) {
    let date = new Date(timespan);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[date.getDay()];
    let hour = date.getHours();
    if (hour < 10) hour = `0${hour}`;
    let minutes = date.getMinutes().toString();
    if (minutes < 10) minutes = `0${minutes}`;

    let fullDate = ` ${day}  ${hour}:${minutes} `;
    setUpdate(fullDate);
  }
  function getDayName(timespan) {
    let date = new Date(timespan);
    let days = ["Sun", "Mo", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    return day;
  }
  function showTempreture(response) {
    console.log(response.data);
    if (response.data.status !== "not_found") {
      setFirst(false);
      formatDate(response.data.daily[0].time * 1000);
      setWeatherInfo({
        city: response.data.city,
        temperature: Math.round(response.data.daily[0].temperature.day),
        description: response.data.daily[0].condition.description,
        humidity: Math.round(response.data.daily[0].temperature.humidity),
        wind: Math.round(response.data.daily[0].wind.speed),
        iconUrl: response.data.daily[0].condition.icon_url,
        icon: response.data.daily[0].condition.icon,
      });
      setForecast(response.data.daily);
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    let apiKey = "af253f0a8o48e8b1400ef66f4294tdf3";
    let apiUrl = "https://api.shecodes.io/weather/v1/forecast?units=metric";
    axios.get(`${apiUrl}&query=${city}&key=${apiKey}`).then(showTempreture);
  }
  function updateCity(event) {
    setCity(event.target.value);
  }
  function changeToFahrenheitTemperature(event) {
    event.preventDefault();
  }
  function changeToCelsiusTemperature(event) {
    event.preventDefault();
  }
  return (
    <div className="weather-wrapper">
      <div className="weather">
        <form id="search-form" className="mb-3" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-9 input-contain">
              <input
                autoComplete="off"
                type="search"
                id="search-text"
                onChange={updateCity}
                className="search-text"
                aria-labelledby="placeholder-search-text"
              />
              <label
                className="placeholder-text"
                htmlFor="search-text"
                id="placeholder-search-text"
              >
                <div className="text">City Name...</div>
              </label>
            </div>
            <div className="col-3">
              <input
                type="submit"
                id="search-button"
                value="Search"
                className="btn btn-primary w-75 search-button"
              />
            </div>
          </div>
        </form>
        {!first ? (
          <div className="row">
            <div className="mb-3">
              <h1 id="city">{weatherInfo.city}</h1>
              <div className="row">
                <ul>
                  <li>
                    last updated: <span id="date-span"> {update}</span>
                  </li>
                  <li id="weather-desc">{weatherInfo.description}</li>
                </ul>
              </div>
            </div>

            <div className="row" id="current-temp-div">
              <div className="col-8">
                <div className="d-flex weather-temperature">
                  <img
                    id="icon"
                    src={weatherInfo.iconUrl}
                    alt={weatherInfo.icon}
                  />
                  <div>
                    <strong id="temperature" className="temp">
                      {weatherInfo.temperature}
                    </strong>
                    <span className="units">
                      <a
                        href="/"
                        className="disable-link"
                        onClick={changeToCelsiusTemperature}
                        id="celsius-link"
                      >
                        °C
                      </a>
                      |{" "}
                      <a
                        href="/"
                        onClick={changeToFahrenheitTemperature}
                        id="fahrenheit-link"
                      >
                        °F
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <ul>
                  <li>
                    Humidity: <span id="humidity">{weatherInfo.humidity}</span>%
                  </li>
                  <li>
                    Wind: <span id="wind-speed">{weatherInfo.wind}</span> km/h
                  </li>
                </ul>
              </div>
            </div>
            <div className="weather-forecast mt-4" id="forecast">
              <div className="row" id="forecast">
                {forecast.map(function (day, index) {
                  if (index >= 1)
                    return (
                      <div class="col-2">
                        <div class="next-day">
                          {getDayName(day.time * 1000)}
                        </div>
                        <img
                          src={day.condition.icon_url}
                          alt={day.condition.description}
                        />
                        <div class="next-temp">
                          <span class="next-day-max">
                            {Math.round(day.temperature.maximum)}
                          </span>
                          <span class="next-day-min">
                            {Math.round(day.temperature.minimum)}
                          </span>
                        </div>
                      </div>
                    );
                  else return <div></div>;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="mb-3">
              <div className="row"></div>
            </div>
          </div>
        )}
      </div>
      <div>
        <ul className="wrapper">
          <li className="icon github">
            <span className="tooltip">Github</span>
            <a
              className="none-link"
              rel="noreferrer"
              target="_blank"
              href="https://github.com/neda-h/weather-react"
            >
              <i className="fab fa-github"></i>
            </a>
          </li>
        </ul>
        <small>
          <a
            className="footer-link"
            href="https://github.com/neda-h/my-exercise-projects/tree/main/WeatherApp"
          >
            Open-source code{" "}
          </a>
          by Neda Hosseiny
        </small>
      </div>
    </div>
  );
}
