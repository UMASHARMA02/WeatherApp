
const citySelect = document.getElementById('city');
const lastUpdated = document.getElementById('last-updated');
const dateDisplay = document.getElementById('date'); // Display date on the left card
const modal = document.getElementById('modal');
const customizeBtn = document.getElementById('customize');
const closeModalBtn = document.getElementById('close-modal');
const highlightsBody = document.getElementById('highlights-body');
const highlightsTable = document.getElementById('highlights-table'); // Assuming there’s an ID for the table
const highlightsTitle = document.getElementById('highlights-title');

// Data storage for historical weather data
let currentUnit = 'Celsius'; // Default unit

// Predefined dummy historical data for each city
const historicalData = {
  'Delhi': [
    { date: '22 Oct 2024', minTemp: 20, maxTemp: 30, avgTemp: 25, condition: 'Sunny', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 18, maxTemp: 28, avgTemp: 23, condition: 'Partly Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 19, maxTemp: 29, avgTemp: 24, condition: 'Sunny', alert: 'No' },
    { date: '19 Oct 2024', minTemp: 17, maxTemp: 26, avgTemp: 22, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 21, maxTemp: 31, avgTemp: 26, condition: 'Cloudy', alert: 'No' },
  ],
  'Mumbai': [
    { date: '22 Oct 2024', minTemp: 25, maxTemp: 33, avgTemp: 29, condition: 'Sunny', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 24, maxTemp: 32, avgTemp: 28, condition: 'Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 23, maxTemp: 31, avgTemp: 27, condition: 'Rain', alert: 'Yes' },
    { date: '19 Oct 2024', minTemp: 22, maxTemp: 30, avgTemp: 26, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 24, maxTemp: 34, avgTemp: 29, condition: 'Sunny', alert: 'No' },
  ],
  'Chennai': [
    { date: '22 Oct 2024', minTemp: 27, maxTemp: 35, avgTemp: 31, condition: 'Sunny', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 26, maxTemp: 34, avgTemp: 30, condition: 'Partly Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 28, maxTemp: 36, avgTemp: 32, condition: 'Cloudy', alert: 'No' },
    { date: '19 Oct 2024', minTemp: 25, maxTemp: 33, avgTemp: 29, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 27, maxTemp: 35, avgTemp: 31, condition: 'Sunny', alert: 'No' },
  ],
  // Add other cities similarly
  'Bangalore': [
    { date: '22 Oct 2024', minTemp: 18, maxTemp: 26, avgTemp: 22, condition: 'Sunny', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 17, maxTemp: 25, avgTemp: 21, condition: 'Partly Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 19, maxTemp: 27, avgTemp: 23, condition: 'Sunny', alert: 'No' },
    { date: '19 Oct 2024', minTemp: 16, maxTemp: 24, avgTemp: 20, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 20, maxTemp: 28, avgTemp: 24, condition: 'Cloudy', alert: 'No' },
  ],
  'Kolkata': [
    { date: '22 Oct 2024', minTemp: 22, maxTemp: 32, avgTemp: 27, condition: 'Cloudy', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 21, maxTemp: 31, avgTemp: 26, condition: 'Partly Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 23, maxTemp: 33, avgTemp: 28, condition: 'Rain', alert: 'Yes' },
    { date: '19 Oct 2024', minTemp: 20, maxTemp: 30, avgTemp: 25, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 22, maxTemp: 32, avgTemp: 27, condition: 'Cloudy', alert: 'No' },
  ],
  'Hyderabad': [
    { date: '22 Oct 2024', minTemp: 20, maxTemp: 28, avgTemp: 24, condition: 'Sunny', alert: 'No' },
    { date: '21 Oct 2024', minTemp: 19, maxTemp: 27, avgTemp: 23, condition: 'Partly Cloudy', alert: 'No' },
    { date: '20 Oct 2024', minTemp: 18, maxTemp: 26, avgTemp: 22, condition: 'Cloudy', alert: 'No' },
    { date: '19 Oct 2024', minTemp: 17, maxTemp: 25, avgTemp: 21, condition: 'Rain', alert: 'Yes' },
    { date: '18 Oct 2024', minTemp: 21, maxTemp: 29, avgTemp: 25, condition: 'Sunny', alert: 'No' },
  ]
};

// Open the customize modal
customizeBtn.addEventListener('click', () => {
  modal.style.display = 'flex'; // Display the modal
});

// Close the modal
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Fetch and display real-time weather data and historical data
citySelect.addEventListener('change', () => {
  updateWeatherData();
  displayHistoricalData(citySelect.value); // Display historical data for the selected city
});

function updateWeatherData() {
  const selectedCity = citySelect.value;
  fetchCurrentWeather(selectedCity);
}

function fetchCurrentWeather(city) {
  const apiKey = '77758097dc3e2831e1782b5369fdcdea'; // Your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const tempInCelsius = data.main.temp;
      const feelsLikeInCelsius = data.main.feels_like;
      const humidity = data.main.humidity;
      const visibility = (data.visibility / 1000).toFixed(1); // Convert to kilometers
      const windSpeed = data.wind.speed;
      const condition = data.weather[0].main;

      updateWeatherUI(tempInCelsius, feelsLikeInCelsius, humidity, visibility, windSpeed, condition);
      updateLastUpdatedTime();
    })
    .catch(err => console.error(err));
}

// Update UI with fetched data
function updateWeatherUI(tempInCelsius, feelsLikeInCelsius, humidity, visibility, windSpeed, condition) {
  const tempElement = document.getElementById('temperature');
  const feelsLikeElement = document.getElementById('feels-like');
  const humidityElement = document.getElementById('humidity');
  const visibilityElement = document.getElementById('visibility');
  const windSpeedElement = document.getElementById('wind-speed');
  const conditionElement = document.getElementById('condition');

  // Update temperature, feels like, humidity, visibility, wind speed, and condition
  tempElement.innerText = `${convertTemperature(tempInCelsius, currentUnit)}°${currentUnit.charAt(0)}`;
  feelsLikeElement.innerText = `${convertTemperature(feelsLikeInCelsius, currentUnit)}°${currentUnit.charAt(0)}`;
  humidityElement.innerText = `${humidity}%`;
  visibilityElement.innerText = `${visibility} km`;
  windSpeedElement.innerText = `${windSpeed} m/s`;
  conditionElement.innerText = condition;

  // Update the date in the left weather card
  const now = new Date();
  dateDisplay.innerText = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
}

// Update last updated time
function updateLastUpdatedTime() {
  const now = new Date();
  lastUpdated.innerText = `Last Updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Display historical weather data for a selected city
function displayHistoricalData(city) {
  const data = historicalData[city];
  highlightsTitle.innerText = `${city}’s Highlights`;
  highlightsBody.innerHTML = ''; // Clear previous data

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${convertTemperature(entry.minTemp, currentUnit)}°${currentUnit.charAt(0)}</td>
      <td>${convertTemperature(entry.maxTemp, currentUnit)}°${currentUnit.charAt(0)}</td>
      <td>${convertTemperature(entry.avgTemp, currentUnit)}°${currentUnit.charAt(0)}</td>
      <td>${entry.condition}</td>
      <td>${entry.alert}</td>
    `;
    highlightsBody.appendChild(row);
  });

  // Make sure the table is visible
  highlightsTable.style.display = 'table';
}

// Temperature Unit Selection Logic
document.getElementById('btn-celsius').addEventListener('click', () => {
  currentUnit = 'Celsius';
  modal.style.display = 'none';
  updateWeatherData();
  displayHistoricalData(citySelect.value);
});

document.getElementById('btn-fahrenheit').addEventListener('click', () => {
  currentUnit = 'Fahrenheit';
  modal.style.display = 'none';
  updateWeatherData();
  displayHistoricalData(citySelect.value);
});

document.getElementById('btn-kelvin').addEventListener('click', () => {
  currentUnit = 'Kelvin';
  modal.style.display = 'none';
  updateWeatherData();
  displayHistoricalData(citySelect.value);
});

// Temperature conversion function
function convertTemperature(temp, unit) {
  if (unit === 'Fahrenheit') {
    return ((temp * 9/5) + 32).toFixed(1);
  } else if (unit === 'Kelvin') {
    return (temp + 273.15).toFixed(1);
  } else {
    return temp.toFixed(1);
  }
}

// Initialize with the default city
updateWeatherData();
displayHistoricalData(citySelect.value);
