const apiKey = "3a02bf65c6977e58e548b91a8982ae98";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const unitSelect = document.getElementById("unitSelect");

const icons = {
  Clouds: "icons/clouds.png",
  Clear: "icons/clear.png",
  Rain: "icons/rain.png",
  Drizzle: "icons/drizzle.png",
  Snow: "icons/snow.png",
  Mist: "icons/mist.png"
};

async function checkWeather(city, unit = "metric") {
  try {
    const response = await fetch(`${apiUrl}${city}&units=${unit}&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data, unit);

  } catch (error) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

function displayWeather(data, unit) {
  document.querySelector(".city").innerHTML = data.name;
  const tempUnit = unit === "metric" ? "°C" : "°F";

  let windSpeed, windUnit;
  if (unit === "metric") {
    windSpeed = (data.wind.speed * 3.6).toFixed(1);
    windUnit = "km/h";
  } else {
    windSpeed = data.wind.speed.toFixed(1);
    windUnit = "mph";
  }

  document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + tempUnit;
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = windSpeed + " " + windUnit;

  weatherIcon.src = icons[data.weather[0].main];

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";

  updateBackground(data.weather[0].main);
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value, unitSelect.value);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value, unitSelect.value);
  }
});

unitSelect.addEventListener("change", () => {
  if (document.querySelector(".city").innerHTML !== "") {
    checkWeather(document.querySelector(".city").innerHTML, unitSelect.value);
  }
});

function updateBackground(condition) {
  const card = document.querySelector(".card");

  switch (condition) {
    case "Clear":
      card.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
      break;
    case "Clouds":
      card.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "Rain":
    case "Drizzle":
      card.style.background = "linear-gradient(135deg, #00c6ff, #0072ff)";
      break;
    case "Snow":
      card.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)";
      break;
    case "Mist":
    case "Fog":
      card.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
      break;
    default:
      card.style.background = "linear-gradient(135deg, #00feba, #5b54ba)";
  }
}

window.onload = () =>{
  checkWeather("Karachi")
}