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
      showWeatherInfo(locationInfo);
      console.log(locationInfo);
    })();
  },
  (error) => {
    (async () => {
      const locationInfo = await getData();
      console.log(locationInfo);
      showWeatherInfo(locationInfo);
    })();

    console.log(error.message);
  }
);

function showWeatherInfo(info) {
  const weatherCard = document.getElementById("weather-card");
  weatherCard.textContent = info.name + ", " + info.sys.country;
}
