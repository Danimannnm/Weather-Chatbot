# Weather Application

A modern, responsive weather application that provides real-time weather information, forecasts, and interactive data visualization. The application features a dark theme interface with multiple views and a built-in chatbot assistant.

## Features

- Real-time weather data fetching using OpenWeather API
- Interactive dashboard with weather widgets and charts
- Dark theme user interface
- Temperature unit conversion (Celsius/Fahrenheit)
- 5-day weather forecast
- Responsive design for mobile and desktop
- Data visualization using Charts.js
- Integrated chatbot with Gemini AI support
- Geolocation support
- Session storage for user preferences
- Weather-based background themes

## Prerequisites

- Modern web browser
- OpenWeather API key
- Google Gemini API key
- Internet connection

## Installation

1. Clone the repository to your local machine:
```bash
git clone cd weather-app
```

2. Set up your API keys:
   - Replace `YOUR_OPEN_API_KEY` in `script_v0.js` and `tables_v0.js` with your OpenWeather API key
   - Replace `YOUR_GEMINI_API_KEY` in `tables_v0.js` with your Google Gemini API key

## Project Structure

```
weather-app/
├── v0.html              # Main dashboard page
├── v0_tables.html       # Tables and chatbot view
├── styles_v0.css        # Stylesheet for the application
├── script_v0.js         # Main JavaScript file for dashboard
└── tables_v0.js         # JavaScript file for tables and chatbot
```

## Running the Application

1. Open `v0.html` in a web browser to access the main dashboard
2. Enter a city name in the search box and click "Get Weather"
3. Toggle between Celsius and Fahrenheit using the temperature unit selector
4. View the weather forecast table and interactive charts
5. Access additional features through the Tables view

## Features Usage

### Dashboard View
- Search for cities
- Toggle temperature units
- View current weather conditions
- See 5-day forecast
- Interact with weather charts

### Tables View
- Sort temperatures (ascending/descending)
- Filter rainy days
- View highest temperature
- Use the integrated chatbot

### Chatbot Features
- Ask about weather in specific cities
- Get AI-powered responses using Gemini
- Natural language interaction

## API Integration

The application uses two main APIs:
1. OpenWeather API
   - Current weather data
   - 5-day forecast
   - Geolocation support

2. Google Gemini API
   - Chatbot functionality
   - Natural language processing

## Responsive Design

The application is fully responsive and adapts to different screen sizes:
- Desktop: Full layout with side menu
- Mobile: Collapsible menu and stacked components

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- API keys are exposed in the frontend code (should be moved to backend in production)
- Limited to 5-day forecast due to API constraints
- Requires internet connection for API calls

## Future Improvements

- Add backend server to secure API keys
- Implement user authentication
- Add more weather data visualizations
- Enhance chatbot capabilities
- Add weather alerts and notifications
- Implement PWA features

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request



## Support

For support, please open an issue in the repository or contact adnankhaliq25@gmail.com.
