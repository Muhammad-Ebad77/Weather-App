const apiKey = "3a02bf65c6977e58e548b91a8982ae98";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const icons = {
  Clouds: "icons/clouds.png",
  Clear: "icons/clear.png",
  Rain: "icons/rain.png",
  Drizzle: "icons/drizzle.png",
  Snow: "icons/snow.png",
  Mist: "icons/mist.png"
};

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// ✅ new function to display data (used by both search & geolocation)
function displayWeather(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

  weatherIcon.src = icons[data.weather[0].main] || "icons/clear.png";

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";

  updateBackground(data.weather[0].main);
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
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

// ✅ Geolocation support on page load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error("Location fetch failed");

        const data = await response.json();
        displayWeather(data);

      } catch (error) {
        console.error("Geolocation fetch failed:", error);
      }
    });
  }
};
