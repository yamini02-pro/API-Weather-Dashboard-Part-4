class WeatherApp {
    constructor() {
        this.apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
        this.currentWeather = null;
        this.forecast = null;
        this.recentSearches = [];
        this.lastCity = null;
    }

    init() {
        this.loadRecentSearches();
        this.loadLastCity();
        this.setupEventListeners();
        this.showWelcome();
    }

    setupEventListeners() {
        const searchBtn = document.getElementById('search-btn');
        const cityInput = document.getElementById('city-input');
        const clearHistoryBtn = document.getElementById('clear-history-btn');

        searchBtn.addEventListener('click', () => this.handleSearch());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    handleSearch() {
        const cityInput = document.getElementById('city-input');
        const city = cityInput.value.trim();
        if (city) {
            this.getWeather(city);
            cityInput.value = '';
        }
    }

    async getWeather(city) {
        try {
            this.showLoading();

            // Fetch current weather
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
            );

            if (!currentResponse.ok) {
                throw new Error('City not found');
            }

            this.currentWeather = await currentResponse.json();

            // Fetch 5-day forecast
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`
            );

            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }

            const forecastData = await forecastResponse.json();
            this.forecast = this.processForecastData(forecastData);

            this.saveRecentSearch(city);
            this.displayWeather();
            this.displayForecast();

        } catch (error) {
            this.showError(error.message);
        }
    }

    processForecastData(data) {
        const dailyForecasts = {};

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    temp: item.main.temp,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    wind: item.wind.speed
                };
            }
        });

        return Object.values(dailyForecasts).slice(0, 5);
    }

    displayWeather() {
        const weatherDisplay = document.getElementById('weather-display');

        weatherDisplay.innerHTML = `
            <h2>${this.currentWeather.name}, ${this.currentWeather.sys.country}</h2>
            <div class="temperature">${Math.round(this.currentWeather.main.temp)}°C</div>
            <div class="description">${this.currentWeather.weather[0].description}</div>
            <img src="https://openweathermap.org/img/wn/${this.currentWeather.weather[0].icon}@2x.png" alt="Weather icon" class="weather-icon">
            <div class="weather-details">
                <p>Humidity: ${this.currentWeather.main.humidity}%</p>
                <p>Wind: ${this.currentWeather.wind.speed} m/s</p>
            </div>
        `;
    }

    displayForecast() {
        const forecastContainer = document.getElementById('forecast');

        forecastContainer.innerHTML = this.forecast.map(day => `
            <div class="forecast-day">
                <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="Weather icon">
                <div class="temp">${Math.round(day.temp)}°C</div>
                <div class="description">${day.description}</div>
            </div>
        `).join('');
    }

    showWelcome() {
        const weatherDisplay = document.getElementById('weather-display');
        weatherDisplay.innerHTML = `
            <h2>Welcome to SkyFetch!</h2>
            <p>Search for a city to get the current weather and 5-day forecast.</p>
            ${this.lastCity ? `<p>Last searched city: <strong>${this.lastCity}</strong></p>` : ''}
        `;
    }

    showLoading() {
        const weatherDisplay = document.getElementById('weather-display');
        weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
    }

    showError(message) {
        const weatherDisplay = document.getElementById('weather-display');
        weatherDisplay.innerHTML = `<div class="error">${message}</div>`;
    }

    loadRecentSearches() {
        const stored = localStorage.getItem('recentSearches');
        if (stored) {
            this.recentSearches = JSON.parse(stored);
        }
        this.displayRecentSearches();
    }

    saveRecentSearch(city) {
        const titleCaseCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

        // Remove duplicates
        this.recentSearches = this.recentSearches.filter(search =>
            search.toLowerCase() !== titleCaseCity.toLowerCase()
        );

        // Add to front
        this.recentSearches.unshift(titleCaseCity);

        // Limit to 5
        if (this.recentSearches.length > 5) {
            this.recentSearches = this.recentSearches.slice(0, 5);
        }

        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));

        // Update last city
        this.lastCity = titleCaseCity;
        localStorage.setItem('lastCity', this.lastCity);

        // Update UI
        this.displayRecentSearches();
    }

    displayRecentSearches() {
        const container = document.getElementById('recent-searches-list');
        container.innerHTML = '';

        this.recentSearches.forEach(city => {
            const button = document.createElement('button');
            button.className = 'recent-search-btn';
            button.textContent = city;
            button.addEventListener('click', () => this.getWeather(city));
            container.appendChild(button);
        });
    }

    loadLastCity() {
        const stored = localStorage.getItem('lastCity');
        if (stored) {
            this.lastCity = stored;
            // Auto-load last city
            this.getWeather(this.lastCity);
        }
    }

    clearHistory() {
        this.recentSearches = [];
        this.lastCity = null;
        localStorage.removeItem('recentSearches');
        localStorage.removeItem('lastCity');
        this.displayRecentSearches();
        this.showWelcome();
    }
}

// Initialize the app
const app = new WeatherApp();
app.init();
