const API_KEY = '';
const GEMINI_API_KEY = '';

const forecastTableBody = document.querySelector('#forecastTable tbody');
const sortAscendingBtn = document.getElementById('sortAscending');
const sortDescendingBtn = document.getElementById('sortDescending');
const filterRainBtn = document.getElementById('filterRain');
const showHighestTempBtn = document.getElementById('showHighestTemp');
const citySearchInput = document.getElementById('citySearch');
const searchButton = document.getElementById('searchButton');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

let forecastData = [];

document.addEventListener('DOMContentLoaded', () => {
    getWeatherForecast('London'); // Default city
});

sortAscendingBtn.addEventListener('click', () => sortTemperatures('asc'));
sortDescendingBtn.addEventListener('click', () => sortTemperatures('desc'));
filterRainBtn.addEventListener('click', filterRainyDays);
showHighestTempBtn.addEventListener('click', showHighestTemperature);
searchButton.addEventListener('click', () => getWeatherForecast(citySearchInput.value));
sendMessageBtn.addEventListener('click', sendChatMessage);

async function getWeatherForecast(city) {
    if (!city) return;

    showLoadingSpinner();

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        forecastData = data.list.filter((item, index) => index % 4  === 0);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        forecastTableBody.innerHTML = '<tr><td colspan="3">Error fetching weather data. Please try again.</td></tr>';
    }

    hideLoadingSpinner();
}

function displayForecast(data) {
    forecastTableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${Math.round(item.main.temp)}°C</td>
            <td>${item.weather[0].description}</td>
        `;
        forecastTableBody.appendChild(row);
    });
}

function sortTemperatures(order) {
    const sortedData = [...forecastData].sort((a, b) => {
        return order === 'asc' ? a.main.temp - b.main.temp : b.main.temp - a.main.temp;
    });
    displayForecast(sortedData);
}

function filterRainyDays() {
    const rainyDays = forecastData.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
    displayForecast(rainyDays);
}

function showHighestTemperature() {
    const highestTemp = forecastData.reduce((max, item) => item.main.temp > max.main.temp ? item : max);
    displayForecast([highestTemp]);
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendChatMessage('You', message);
    chatInput.value = '';

    if (message.toLowerCase().includes('weather')) {
        const weatherResponse = await getWeatherResponse(message);
        appendChatMessage('Bot', weatherResponse);
    } else {
        const geminiResponse = await getGeminiResponse(message);
        appendChatMessage('Bot', geminiResponse);
    }
}

async function getWeatherResponse(message) {
    const cityMatch = message.match(/weather in (\w+)/i);
    if (cityMatch) {
        const city = cityMatch[1];
        try {
            const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`).then(res => res.json());
            return `The current weather in ${city} is ${weatherData.weather[0].description} with a temperature of ${Math.round(weatherData.main.temp)}°C.`;
        } catch (error) {
            return "I'm sorry, I couldn't fetch the weather information for that city.";
        }
    }
    return "I'm sorry, I couldn't understand which city you're asking about.";
}

async function getGeminiResponse(message) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: message
                }]
            }]
        })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function appendChatMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}
