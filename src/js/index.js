import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "../css/style.css";
import "../assets/cloud.png";
import { getData, getDataByCity, getDataWeek } from "./fetchData";

const weatherCard = document.getElementById("weather-card");
const weatherInfo = document.getElementById("weather-info");
const weatherDays = document.getElementById("weather-days");
const leftDiv = document.getElementsByClassName("weather-left")[0];
const rightDiv = document.getElementsByClassName("weather-right")[0];
const container = document.getElementById("weather-timeline");
const weatherDescription = document.getElementsByClassName(
  "description-container"
)[0];
const getLocationForm = document.getElementById("location-form");

const currentLocation = navigator.geolocation.getCurrentPosition(
  (response) => {
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
  const btnToggleTemp = document.createElement("button");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");
  const weatherState = document.createElement("p");
  const stateDescription = document.createElement("p");
  const location = document.createElement("p");
  const countryFlag = document.createElement("img");

  resetHTML();
  filteredTimeline(info.coord.lat, info.coord.lon);

  //Classes
  temp.classList.add("temp");
  btnToggleTemp.classList.add("fahrenheit");
  btnToggleTemp.classList.add("selected-temperature");
  weatherState.classList.add("location-description");
  stateDescription.classList.add("location-description");
  humidity.classList.add("weather-description");
  location.classList.add("location-description");
  windSpeed.classList.add("weather-description");
  countryFlag.classList.add("country-flag");

  //Setting attributes
  location.textContent = info.name + ", " + info.sys.country;
  countryFlag.src = "https://countryflagsapi.com/png/" + info.sys.country;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`
  );
  location.appendChild(countryFlag);
  temp.textContent = info.main.temp;
  weatherState.textContent = info.weather[0].main;
  stateDescription.textContent =
    info.weather[0].description[0].toUpperCase() +
    info.weather[0].description.slice(1);
  humidity.innerHTML =
    "<i class='fa-solid fa-droplet'></i>  " + info.main.humidity + "%";
  windSpeed.innerHTML =
    "<i class='fa-solid fa-wind'></i>  " + info.wind.speed + " mpH";

  btnToggleTemp.textContent = "°F";

  //Toggle Temp
  btnToggleTemp.onclick = () => {
    btnToggleTemp.classList.add("selected-temperature");

    const children = container.children;
    if (btnToggleTemp.textContent == "°C") {
      let currentTemp = parseFloat(temp.textContent);
      temp.textContent = (currentTemp * (9 / 5) + 32).toFixed(2);
      for (let i = 0; i < children.length; i++) {
        let tempTimeLine = children[i].lastChild.textContent.split(" ");
        if (tempTimeLine[1] == "°C") {
          children[i].lastChild.textContent =
            ((parseFloat(tempTimeLine[0]) * 9) / 5 + 32).toFixed(2) + " °F";
        }
      }
      btnToggleTemp.textContent = "°F";
    } else if (btnToggleTemp.textContent == "°F") {
      temp.textContent = ((info.main.temp - 32) * (5 / 9)).toFixed(2);
      for (let i = 0; i < children.length; i++) {
        let tempTimeLine = children[i].lastChild.textContent.split(" ");
        if (tempTimeLine[1] == "°F") {
          children[i].lastChild.textContent =
            ((parseFloat(tempTimeLine[0]) - 32) * (5 / 9)).toFixed(2) + " °C";
        }
      }
      btnToggleTemp.textContent = "°C";
    }
  };

  weatherInfo.appendChild(location);

  leftDiv.appendChild(weatherIcon);
  rightDiv.appendChild(temp);
  rightDiv.appendChild(btnToggleTemp);

  weatherDescription.appendChild(weatherState);
  weatherDescription.appendChild(stateDescription);
  weatherDescription.appendChild(humidity);
  weatherDescription.appendChild(windSpeed);

  weatherCard.appendChild(leftDiv);
  weatherCard.appendChild(rightDiv);
  weatherCard.appendChild(weatherDescription);
}

async function cityWeatherInfo(city) {
  const val = await getDataByCity(city);
  if (val != undefined) {
    resetHTML();
    skeletonLoader();
    setTimeout(() => {
      generalWeatherInfo(val);
    }, 600);
  }
}
async function filteredTimeline(lat, lon) {
  const info = await getDataWeek(lat, lon);
  const days = getDays(info.list);

  timeLine(info, days[0]);

  weatherDays.innerHTML = "";

  days.forEach((element) => {
    const div = document.createElement("div");
    const day = document.createElement("p");
    let date = new Date(element.replaceAll("-", "/")).toString().split(" ");

    div.dataset.date = element;
    div.classList.add("day-card");

    day.textContent = date[0] + ", " + date[1] + " " + date[2];
    div.appendChild(day);
    div.addEventListener("click", function () {
      resetSelectedDay();
      this.classList.add("selected-day");
      timeLine(info, this.dataset.date);
    });
    weatherDays.appendChild(div);
  });
}

function getDays(info) {
  let days = [];
  info.forEach((element) => {
    let splitDate = element.dt_txt.split(" ");
    let justDate = splitDate[0];
    if (!days.includes(justDate)) days.push(justDate);
  });
  return days;
}

function resetHTML() {
  leftDiv.innerHTML =
    rightDiv.innerHTML =
    container.innerHTML =
    weatherDescription.innerHTML =
    weatherInfo.innerHTML =
      "";

  container.classList.remove("skeleton");
  weatherCard.classList.remove("skeleton");
  weatherInfo.classList.remove("skeleton");
  weatherInfo.classList.remove("skeleton-text");
  leftDiv.classList.remove("skeleton");
  leftDiv.classList.remove("skeleton-text");
}

function timeLine(info, date) {
  info = info.list.filter((element) => {
    return element.dt_txt.startsWith(date);
  });

  container.innerHTML = "";
  container.classList.remove("skeleton");

  info.forEach((element) => {
    const div = document.createElement("div");
    const p3 = document.createElement("p");
    const p4 = document.createElement("p");
    const p = document.createElement("p");
    const p2 = document.createElement("p");
    const img = document.createElement("img");

    div.classList.add("timeline-item");

    let time = element.dt_txt.split(" ");
    let toDate = new Date(time[0].replaceAll("-", "/"));

    p.innerHTML = "<i class='fa-regular fa-clock'></i> " + time[1].slice(0, -3);
    p2.textContent = element.weather[0].main;
    p3.textContent = toDate.toString().slice(0, 10);
    p4.textContent = element.main.temp + " °F";
    img.src =
      "http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png";
    div.appendChild(p);
    div.appendChild(img);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(p4);
    container.appendChild(div);
  });
}
function resetSelectedDay() {
  const dayCards = document.getElementsByClassName("day-card");
  for (let i = 0; i < dayCards.length; i++) {
    let currentDay = dayCards[i];
    if (currentDay.classList.contains("selected-day")) {
      currentDay.classList.remove("selected-day");
    }
  }
}

function skeletonLoader() {
  leftDiv.innerHTML = "";

  rightDiv.innerHTML = "";
  weatherDescription.innerHTML = "";

  weatherInfo.innerHTML = "";
  weatherInfo.classList.add("skeleton");
  weatherInfo.classList.add("skeleton-text");

  weatherCard.classList.add("skeleton");

  container.innerHTML = "";
  container.classList.add("skeleton");
}

getLocationForm.onsubmit = (e) => {
  const city = document.getElementById("txtLocation");
  e.preventDefault();
  if (city.value.trim() != "") {
    city.classList.remove("error");
    cityWeatherInfo(city.value);
    city.value = null;
  } else {
    city.classList.add("error");
    city.focus();
  }
};
