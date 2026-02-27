# SkyFetch Weather Dashboard

A professional weather dashboard application that provides current weather conditions and 5-day forecasts for cities around the world.

## Features

- **Current Weather**: Display temperature, weather description, humidity, and wind speed
- **5-Day Forecast**: Show weather predictions for the next 5 days
- **Recent Searches**: Save and display up to 5 recent city searches
- **Auto-Load**: Automatically load the last searched city on page refresh
- **Clear History**: Option to clear all recent searches
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+ with OOP)
- OpenWeatherMap API
- localStorage for data persistence

## Setup

1. Clone the repository
2. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
3. Replace `YOUR_API_KEY` in `app.js` with your actual API key
4. Open `index.html` in a web browser

## localStorage Features

- **recentSearches**: Stores up to 5 recent city searches
- **lastCity**: Stores the last searched city for auto-load

## Deployment

This project is deployed on Vercel. Visit the live site at: [Vercel URL]

## Project Structure

```
├── index.html      # Main HTML file
├── style.css      # CSS styles
├── app.js         # JavaScript application logic
├── README.md      # Project documentation
└── .gitignore    # Git ignore file
```

## License

MIT
