// import "@fortawesome/fontawesome-free/js/fontawesome";
// import "@fortawesome/fontawesome-free/js/solid";
// import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "../css/style.css";
import { getData, getDataByCity, getDataWeek } from "./fetchData";

const weatherCard = document.getElementById("weather-card");
const weatherInfo = document.getElementById("weather-info");
const leftDiv = document.getElementsByClassName("weather-left")[0];
const rightDiv = document.getElementsByClassName("weather-right")[0];
const container = document.getElementById("weather-timeline");
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
  const btnToggleTemp = document.createElement("button");
  // const c = document.createElement("button");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");
  const location = document.createElement("p");

  resetHTML();
  timeLine(info.coord.lat, info.coord.lon);

  //Classes
  temp.classList.add("temp");
  btnToggleTemp.classList.add("fahrenheit");
  btnToggleTemp.classList.add("selected-temperature");
  humidity.classList.add("weather-description");
  location.classList.add("location-description");
  windSpeed.classList.add("weather-description");

  //Setting attributes
  location.textContent = `${info.name}, ${info.sys.country}; ${info.weather[0].main} - ${info.weather[0].description}`;
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`
  );
  temp.textContent = info.main.temp;
  humidity.innerHTML = "<b>Humidity:</b> " + info.main.humidity + "%";
  windSpeed.innerHTML = "<b>Wind:</b> " + info.wind.speed + " mpH";
  btnToggleTemp.textContent = "°F";

  //To Fahrenheit
  btnToggleTemp.onclick = () => {
    btnToggleTemp.classList.add("selected-temperature");

    const children = container.children;
    if (btnToggleTemp.textContent == "°C") {
      let currentTemp = parseFloat(temp.textContent);
      temp.textContent = (currentTemp * (9 / 5) + 32).toFixed(2);
      for (let i = 0; i < children.length; i++) {
        let tempTimeLine = children[i].lastChild.textContent.split(" ");
        children[i].lastChild.textContent =
          ((parseFloat(tempTimeLine[0]) * 9) / 5 + 32).toFixed(2) + " °F";
      }

      btnToggleTemp.textContent = "°F";
    } else if (btnToggleTemp.textContent == "°F") {
      temp.textContent = ((info.main.temp - 32) * (5 / 9)).toFixed(2);
      for (let i = 0; i < children.length; i++) {
        let tempTimeLine = children[i].lastChild.textContent.split(" ");
        children[i].lastChild.textContent =
          ((parseFloat(tempTimeLine[0]) - 32) * (5 / 9)).toFixed(2) + " °C";
      }
      btnToggleTemp.textContent = "°C";
    }
  };

  weatherInfo.appendChild(location);

  leftDiv.appendChild(weatherIcon);
  rightDiv.appendChild(temp);
  rightDiv.appendChild(btnToggleTemp);

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

async function timeLine(lat, lon) {
  container.innerHTML = "";
  const info = await getDataWeek(lat, lon);
  container.classList.remove("skeleton");

  info.list.forEach((element) => {
    const div = document.createElement("div");
    const p3 = document.createElement("p");
    const p4 = document.createElement("p");
    const p = document.createElement("p");
    const p2 = document.createElement("p");
    const img = document.createElement("img");

    div.classList.add("timeline-item");

    let time = element.dt_txt.split(" ");
    let toDate = new Date(time[0]);

    p.textContent = time[1].slice(0, -3);
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
