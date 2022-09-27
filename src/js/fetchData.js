import key from "./key.js";

async function getData(
  latitude = 13.695804686295393,
  longitude = -89.21216453819646
) {
  let info;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`
    );

    if (response.status == 200) {
      const data = await response.json();
      info = data;
      return info;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
  return info;
}

async function getDataByCity(city) {
  let info;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`
    );

    if (response.status == 200) {
      const data = await response.json();
      info = data;
      return info;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
  return info;
}

export { getData };
