const apiKey = '71046cdf3e9339177a903b7ef6f1f523';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const forecast = document.getElementById('forecast');

let currentWeatherData = null;

// Initial dummy data
const dummyWeatherData = {
        name: 'Searched City',
        main: { temp: 25, humidity: 60 },
        date: new Date()
};

const dummyForecastData = {
        list: [
                { dt_txt: '2024-06-08 12:00:00', main: { temp: 25, humidity: 65 } },
                { dt_txt: '2024-06-09 12:00:00', main: { temp: 26, humidity: 70 } },
                { dt_txt: '2024-06-10 12:00:00', main: { temp: 27, humidity: 75 } },
                { dt_txt: '2024-06-11 12:00:00', main: { temp: 28, humidity: 80 } }
        ]
};
document.addEventListener('DOMContentLoaded', () => {
        displayWeatherData(dummyWeatherData);
        displayForecastData(dummyForecastData);
});

searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
                getWeatherData(city);
                getForecastData(city);
        }
});

cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
                searchBtn.click();
        }
});

async function getWeatherData(city) {
        try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                if (response.ok) {
                        currentWeatherData = { ...data, date: new Date() };
                        displayWeatherData(currentWeatherData);
                } else {
                        weatherInfo.innerHTML = `<p>Error: ${data.message}</p>`;
                }
        
        } catch (error) {
                weatherInfo.innerHTML = `<p>Failed to fetch weather data. Please try again later.</p>`;
        }
}

async function getForecastData(city) {
        try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
                const data = await response.json();
                if (response.ok) {
                        displayForecastData(data);
                
                } else {
                        forecast.innerHTML = `<p>Error: ${data.message}</p>`;
                }
        
        } catch (error) {
                forecast.innerHTML = `<p>Failed to fetch forecast data. Please try again later.</p>`;
        }
}

function displayWeatherData(data) {
        const { name, main, date } = data;
        weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <p><i class="fas fa-calendar-alt"></i> Date: ${date.toLocaleDateString()}</p>
        <p><i class="fas fa-thermometer-half"></i> Temperature: ${main.temp} °C</p>
        <p><i class="fas fa-tint"></i> Humidity: ${main.humidity} %</p>
        `;
}

function displayForecastData(data) {
        forecast.innerHTML = '';
        const dailyData = data.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(0, 4);
        dailyData.forEach((day, index) => {
                const { dt_txt, main} = day;
                const date = new Date(dt_txt);
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('day');
                forecastItem.innerHTML = `
                <p><i class="fas fa-calendar-day"></i> ${date.toLocaleDateString(index)}</p>
                <p><i class="fas fa-thermometer-half"></i> Temp: ${main.temp} °C</p>
                <p><i class="fas fa-tint"></i> Humidity: ${main.humidity} %</p>
                `;
                
                forecastItem.addEventListener('click', () => {
                        currentWeatherData = { ...currentWeatherData, ...day, date };
                        displayWeatherData(currentWeatherData);
                });
                
                forecast.appendChild(forecastItem);
        });
}
