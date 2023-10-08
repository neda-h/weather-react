import React, { useState } from "react";
import axios from "axios";
import "./styles.css";
import ReactAnimatedWeather from "react-animated-weather";

export default function Weather() {
  let [first, setFirst] = useState(true);
  let [forecast, setForecast] = useState([{}]);
  let [city, setCity] = useState("");
  let [weatherInfo, setWeatherInfo] = useState({});
  let [update, setUpdate] = useState();
  let iconMatching = {
    "01d": "CLEAR_DAY",
    "01n": "CLEAR_NIGHT",
    "02d": "PARTLY_CLOUDY_DAY",
    "02n": "PARTLY_CLOUDY_NIGHT",
    "03d": "CLOUDY",
    "03n": "CLOUDY",
    "04d": "CLOUDY",
    "04n": "CLOUDY",
    "09d": "RAIN",
    "09n": "RAIN",
    "10d": "RAIN",
    "10n": "RAIN",
    "11d": "SLEET",
    "11n": "SLEET",
    "13d": "SNOW",
    "13n": "SNOW",
    "50d": "FOG",
    "50n": "FOG",
  };

  if (city === "") {
    setCity("Sari");
    let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
    let apiUrl = "https://api.openweathermap.org";
    axios
      .get(`${apiUrl}/data/2.5/forecast?appid=${apiKey}&units=metric&q=sari`)
      .then(showTempreture);
  }
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
    return fullDate;
  }
  function getDayName(timespan) {
    let date = new Date(timespan);
    let days = ["Sun", "Mo", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    return day;
  }
  function handleForecast(response) {
    let daily = response.data.daily;
    console.log(response);
    setUpdate(formatDate(response.data.current.dt * 1000));
    setForecast(
      [0, 1, 2, 3, 4].map((index) => {
        return {
          icon: daily[index].weather[0].icon,
          min_temp: Math.round(daily[index].temp.min),
          max_temp: Math.round(daily[index].temp.max),
          day: getDayName(daily[index].dt * 1000),
        };
      })
    );
  }
  function showTempreture(response) {
    if (response !== null && response.data.status !== "not_found") {
      console.log(response);
      setFirst(false);
      setWeatherInfo({
        city: response.data.city.name,
        temperature: Math.round(response.data.list[0].main.temp),
        description: response.data.list[0].weather[0].description,
        humidity: Math.round(response.data.list[0].main.humidity),
        wind: response.data.list[0].wind.speed,
        icon: response.data.list[0].weather[0].icon,
      });

      let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
      let longitude = response.data.city.coord.lon;
      let latitude = response.data.city.coord.lat;
      let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      axios.get(apiUrl).then(handleForecast);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(showTempreture);
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
                defaultValue="Sari"
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
                  <li id="li-up">
                    <span id="date-span"> {update}</span>
                  </li>
                  <li id="weather-desc" className="text-capitalize">
                    {weatherInfo.description}
                  </li>
                </ul>
              </div>
            </div>

            <div className="row" id="current-temp-div">
              <div className="col-8">
                <div className="d-flex weather-temperature">
                  <div className="temp-img">
                    {" "}
                    <ReactAnimatedWeather
                      icon={iconMatching[weatherInfo.icon]}
                      color="#000"
                      size={52}
                      animate={true}
                    />
                  </div>
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
                  <li id="li-h">
                    Humidity: <span id="humidity">{weatherInfo.humidity}</span>%
                  </li>
                  <li id="li-w">
                    Wind: <span id="wind-speed">{weatherInfo.wind}</span> km/h
                  </li>
                </ul>
              </div>
            </div>
            <div className="weather-forecast mt-4" id="forecast">
              <div className="row mt-4" id="forecast">
                {forecast.map(function (day, index) {
                  return (
                    <div className="col">
                      <div className="next-day mb-3">{day.day}</div>
                      <ReactAnimatedWeather
                        icon={iconMatching[day.icon]}
                        color="#000"
                        size={38}
                        animate={true}
                      />
                      <div className="next-temp mt-2">
                        <span className="next-day-max">{day.max_temp}°</span>
                        <span className="next-day-min">{day.min_temp}°</span>
                      </div>
                    </div>
                  );
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
          <li className="icon github" id="li-git">
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
            href="https://github.com/neda-h/weather-react"
          >
            Open-source code{" "}
          </a>
          by Neda Hosseiny
        </small>
      </div>
    </div>
  );
}
