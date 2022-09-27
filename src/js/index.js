// import "@fortawesome/fontawesome-free/js/fontawesome";
// import "@fortawesome/fontawesome-free/js/solid";
// import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "../css/style.css";
import { getData } from "./fetchData";

const currentLocation = navigator.geolocation.getCurrentPosition(
  (response) => {
    // console.log(response);
    (async () => {
      const locationInfo = await getData(
        response.coords.latitude,
        response.coords.longitude
      );
      generalWeatherInfo(locationInfo);
      console.log(locationInfo);
    })();
  },
  (error) => {
    (async () => {
      const locationInfo = await getData();
      console.log(locationInfo);
      generalWeatherInfo(locationInfo);
    })();

    console.log(error.message);
  }
);

function generalWeatherInfo(info) {
  const weatherCard = document.getElementById("weather-card");
  const weatherInfo = document.getElementById("weather-info");
  const leftDiv = document.createElement("div");
  const rightDiv = document.createElement("div");
  const weatherIcon = document.createElement("img");
  const weatherDescription = document.createElement("div");
  const temp = document.createElement("p");
  const f = document.createElement("button");
  const c = document.createElement("button");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");
  const location = document.createElement("p");
  // const timeZone = document.createElement("p");

  //Adding Classes
  weatherInfo.classList.add("weather-info");
  leftDiv.classList.add("weather-left");
  rightDiv.classList.add("weather-right");
  temp.classList.add("temp");
  f.classList.add("fahrenheit");
  f.classList.add("selected-temperature");
  c.classList.add("celsius");
  weatherDescription.classList.add("description-container");
  humidity.classList.add("weather-description");
  windSpeed.classList.add("weather-description");

  //Setting attributes

  location.textContent = `${info.name}, ${info.sys.country}`;
  // timeZone.textContent = new Date(Date.UTC(info.timeZone));
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`
  );
  temp.textContent = info.main.temp;
  humidity.textContent = "Humidity: " + info.main.humidity + "%";
  windSpeed.textContent = "Wind Speed: " + info.wind.speed + " mpH";
  f.textContent = "°F";
  c.textContent = "°C";

  f.onclick = () => {
    f.classList.add("selected-temperature");
    c.classList.remove("selected-temperature");
    let currentTemp = parseFloat(temp.textContent);
    if (currentTemp != info.main.temp) {
      temp.textContent = (currentTemp * (9 / 5) + 32).toFixed(2);
    }
  };

  c.onclick = () => {
    f.classList.remove("selected-temperature");
    c.classList.add("selected-temperature");
    let currentTemp = parseFloat(temp.textContent).toFixed(2);
    let toCelcius = ((info.main.temp - 32) * (5 / 9)).toFixed(2);
    if (toCelcius != currentTemp) {
      temp.textContent = toCelcius;
    }
  };

  weatherInfo.appendChild(location);
  // weatherInfo.appendChild(timeZone);
  leftDiv.appendChild(weatherIcon);
  rightDiv.appendChild(temp);
  rightDiv.appendChild(f);
  rightDiv.appendChild(c);
  weatherDescription.appendChild(humidity);
  weatherDescription.appendChild(windSpeed);

  weatherCard.appendChild(leftDiv);
  weatherCard.appendChild(rightDiv);
  weatherCard.appendChild(weatherDescription);
}
