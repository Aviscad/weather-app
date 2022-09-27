// import "@fortawesome/fontawesome-free/js/fontawesome";
// import "@fortawesome/fontawesome-free/js/solid";
// import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "../css/style.css";
import { getData, getDataByCity } from "./fetchData";

const weatherCard = document.getElementById("weather-card");
const weatherInfo = document.getElementById("weather-info");
const leftDiv = document.getElementsByClassName("weather-left")[0];
const rightDiv = document.getElementsByClassName("weather-right")[0];
const weatherDescription = document.getElementsByClassName(
  "description-container"
)[0];
const getLocationForm = document.getElementById("location-form");

const currentLocation = navigator.geolocation.getCurrentPosition(
  (response) => {
    // console.log(response);
    (async () => {
      const locationInfo = await getData(
        response.coords.latitude,
        response.coords.longitude
      );
      generalWeatherInfo(locationInfo);
    })();
  },
  (error) => {
    (async () => {
      const locationInfo = await getData();
      generalWeatherInfo(locationInfo);
    })();

    console.log(error.message);
  }
);

function generalWeatherInfo(info) {
  const weatherIcon = document.createElement("img");
  const temp = document.createElement("p");
  const f = document.createElement("button");
  const c = document.createElement("button");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");
  const location = document.createElement("p");

  resetHTML();

  //Classes
  temp.classList.add("temp");
  f.classList.add("fahrenheit");
  f.classList.add("selected-temperature");
  c.classList.add("celsius");
  humidity.classList.add("weather-description");
  location.classList.add("location-description");
  windSpeed.classList.add("weather-description");

  //Setting attributes
  location.textContent = `${info.name}, ${info.sys.country}`;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`
  );
  temp.textContent = info.main.temp;
  humidity.innerHTML = "<b>Humidity:</b> " + info.main.humidity + "%";
  windSpeed.innerHTML = "<b>Wind:</b> " + info.wind.speed + " mpH";
  f.textContent = "°F";
  c.textContent = "°C";

  //To Fahrenheit
  f.onclick = () => {
    f.classList.add("selected-temperature");
    c.classList.remove("selected-temperature");
    let currentTemp = parseFloat(temp.textContent);
    if (currentTemp != info.main.temp) {
      temp.textContent = (currentTemp * (9 / 5) + 32).toFixed(2);
    }
  };

  //To Celcius
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

async function cityWeatherInfo(city) {
  const val = await getDataByCity(city);
  if (val != undefined) {
    skeletonLoader();
    setTimeout(() => {
      generalWeatherInfo(val);
    }, 600);
  }
}

function resetHTML() {
  leftDiv.innerHTML =
    rightDiv.innerHTML =
    weatherDescription.innerHTML =
    weatherInfo.innerHTML =
      "";

  weatherCard.classList.remove("skeleton");
  weatherInfo.classList.remove("skeleton");
  weatherInfo.classList.remove("skeleton-text");
  leftDiv.classList.remove("skeleton");
  leftDiv.classList.remove("skeleton-text");
}

function skeletonLoader() {
  leftDiv.innerHTML = "";
  leftDiv.classList.add("skeleton");
  leftDiv.classList.add("skeleton-text");

  rightDiv.innerHTML = "";
  weatherDescription.innerHTML = "";

  weatherInfo.innerHTML = "";
  weatherInfo.classList.add("skeleton");
  weatherInfo.classList.add("skeleton-text");

  weatherCard.classList.add("skeleton");
}

getLocationForm.onsubmit = (e) => {
  const city = document.getElementById("txtLocation");
  e.preventDefault();
  if (city.value.trim() != "") {
    cityWeatherInfo(city.value);
  } else {
    alert("City is Required");
  }
};
