# Cloud Compass

Cloud Compass is a weather app that allows users to view a city's current weather and temperature, as well as view that city's 3-day weather forecast.

## Description

This app was built using React and Node.js and uses Openweather's Current Weather Data, and 5 day / 3 hour forecast APIs to retrieve the weather data.
While building the app, I faced many challenges such as managing and updating state in React, handling cities with identical names in different countries, and ensuring accurate forecast data. Although some concepts remain challenging and I feel there's still more to learn, this project helped me better understand how to read and use APIs.
This app allows users to:

- View the current weather and temperature for a default city when first loading the app.
- Search for cities using the search bar.
- View the current weather and temperature for a selected city, along with that city’s 3-day forecast.
- Select suggested cities from the dropdown menu when typing a city name.

## Why I built this

This was a project that was part of the Front End Engineer career path on Codecademy. It was the final project I completed in the career path in order for me to earn my certificate of completion.

## Getting started locally

1. Clone the repository.
2. Make sure you have Node installed.
3. Navigate to project directory and run `npm install`.
4. Set up an Openweather API key:

- Go to https://openweathermap.org/ and create an account or sign in.
- Click on `API keys` or `My API keys` and generate an API key.
- Create a .env file in the root directory.
- Add the following line to the .env file:
  `REACT_APP_API_KEY=your_api_key_here`
- Replace `your_api_key_here` with your actual Openweather API key.

5. Run `npm start` to start the development server.

## Deployed at

This app was deployed using Netlify at: `https://cloud-compass.netlify.app`

## Contributors

- Jacob Rodriguez
