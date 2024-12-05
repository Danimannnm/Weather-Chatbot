const API_KEY = '';

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeather');
const unitToggle = document.getElementById('unitToggle');
const weatherWidget = document.getElementById('weatherWidget');
const cityNameElement = document.getElementById('cityName');
const currentWeatherElement = document.getElementById('currentWeather');
const forecastTableBody = document.querySelector('#forecastTable tbody');
const loadingSpinner = document.getElementById('loadingSpinner');

let forecastData = [];
let temperatureChart, conditionsChart, lineChart; // Chart references

// Load stored values from session storage when the page loads
window.onload = () => {
    const storedCity = sessionStorage.getItem('city');
    const storedUnit = sessionStorage.getItem('unit');
    const storedWeatherData = sessionStorage.getItem('weatherData');

    if (storedCity) {
        cityInput.value = storedCity;
    }

    if (storedUnit) {
        unitToggle.value = storedUnit;
    }

    if (storedWeatherData) {
        const weatherData = JSON.parse(storedWeatherData);
        displayCurrentWeather(weatherData.current);
        displayForecast(weatherData.forecast);
        createCharts(weatherData.forecast);
    } else {
        // Attempt to get user's location if no stored weather data
        getLocation();
    }
};

// Function to get user's geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            error => {
                handleGeolocationError(error);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Handle geolocation errors
function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Geolocation access denied. Please enter your city manually.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please enter your city manually.");
            break;
        case error.TIMEOUT:
            alert("The request to get your location timed out. Please enter your city manually.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred. Please enter your city manually.");
            break;
    }
}

// Save city and unit to session storage when getting weather
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    const units = unitToggle.value;

    if (city) {
        sessionStorage.setItem('city', city);
        sessionStorage.setItem('unit', units);
    }

    getWeather(); // Call the weather function
});

unitToggle.addEventListener('change', () => {
    const city = cityInput.value.trim();
    const units = unitToggle.value;

    if (city) {
        sessionStorage.setItem('city', city);
        sessionStorage.setItem('unit', units);
    }

    getWeather(); // Call the weather function
});

// Function to fetch weather data by coordinates
async function getWeatherByCoordinates(lat, lon) {
    const units = unitToggle.value;

    try {
        const currentWeather = await fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);
        const forecast = await fetchWeatherData(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        createCharts(forecast);

        // Save data to session storage
        sessionStorage.setItem('weatherData', JSON.stringify({
            current: currentWeather,
            forecast: forecast
        }));
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Fetch weather data using city name
async function getWeather() {
    const city = cityInput.value.trim();
    const units = unitToggle.value;

    // Clear current weather before searching
    clearCurrentWeather();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    showLoadingSpinner();

    try {
        const currentWeather = await fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`);
        const forecast = await fetchWeatherData(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`);

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        createCharts(forecast);

        // Save data to session storage
        sessionStorage.setItem('weatherData', JSON.stringify({
            current: currentWeather,
            forecast: forecast
        }));
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }

    hideLoadingSpinner();
}

async function fetchWeatherData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather data not found: ' + response.statusText);
    }
    return response.json();
}

function displayCurrentWeather(data) {
    if (!data || !data.main || !data.weather) {
        console.error('Invalid current weather data:', data);
        return;
    }

    const { name, main, weather, wind } = data;
    const temperature = Math.round(main.temp);
    const description = weather[0].description;
    const icon = weather[0].icon;

    cityNameElement.textContent = name;
    currentWeatherElement.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>${temperature}°${unitToggle.value === 'metric' ? 'C' : 'F'}</p>
        <p>${description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind: ${wind.speed} ${unitToggle.value === 'metric' ? 'm/s' : 'mph'}</p>
    `;

    setWeatherBackground(weather[0].main);
}

function clearCurrentWeather() {
    cityNameElement.textContent = '';
    currentWeatherElement.innerHTML = '';
}

function setWeatherBackground(weatherCondition) {
    const backgrounds = {
        Clear: 'url("clear.jpg")',
        Clouds: 'url("cloudy.jpg")',
        Rain: 'url("rainy.jpg")',
        Snow: 'url("snowy.jpg")',
        Thunderstorm: 'url("thunderstorm.jpg")',
    };

    weatherWidget.style.backgroundImage = backgrounds[weatherCondition] || 'none';
}

function displayForecast(data) {
    if (!data || !data.list) {
        console.error('Invalid forecast data:', data);
        return;
    }

    forecastData = data.list.filter((item, index) => index % 8 === 0);
    updateForecastTable();
}

function updateForecastTable() {
    forecastTableBody.innerHTML = '';
    forecastData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${Math.round(item.main.temp)}°${unitToggle.value === 'metric' ? 'C' : 'F'}</td>
            <td>${item.weather[0].description}</td>
        `;
        forecastTableBody.appendChild(row);
    });
}

function createCharts(data) {
    const next5Days = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    const labels = next5Days.map(day => new Date(day.dt * 1000).toLocaleDateString());
    const temperatures = next5Days.map(day => day.main.temp);
    const conditions = next5Days.map(day => day.weather[0].main);

    // Destroy previous charts if they exist
    if (temperatureChart) temperatureChart.destroy();
    if (conditionsChart) conditionsChart.destroy();
    if (lineChart) lineChart.destroy();

    temperatureChart = createTemperatureBarChart(labels, temperatures);
    conditionsChart = createConditionsDoughnutChart(conditions);
    lineChart = createTemperatureLineChart(labels, temperatures);
}

function createTemperatureBarChart(labels, temperatures) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createConditionsDoughnutChart(conditions) {
    const ctx = document.getElementById('conditionsChart').getContext('2d');
    const conditionCounts = {};

    conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        }
    });
}

function createTemperatureLineChart(labels, temperatures) {
    const ctx = document.getElementById('temperatureLineChart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Over Next 5 Days',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `Temp: ${Math.round(context.raw)}°${unitToggle.value === 'metric' ? 'C' : 'F'}`;
                        }
                    }
                }
            },
            animation: {
                delay: (context) => context.dataIndex * 300
            }
        }
    });
}

function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}
