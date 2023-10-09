import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import ReactAnimatedWeather from "react-animated-weather";

export default function WeatherForecast(props) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState(null);
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

  function getDayName(timespan) {
    let date = new Date(timespan);
    let days = ["Sun", "Mo", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[date.getDay()];
    return day;
  }

  useEffect(() => {
    setLoaded(false);
  }, [props.coord]);

  function handleForecast(response) {
    setForecast(response.data.daily);
    setLoaded(true);
    let daily = response.data.daily;
    console.log(response);
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
  function loadForecast() {
    let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";
    let longitude = props.coord.lon;
    let latitude = props.coord.lat;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(handleForecast);
  }
  if (loaded) {
    return (
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
    );
  } else {
    loadForecast();
    return null;
  }
}
