const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

app.get("/cities", async (req, res) => {
  try {
    const response = await axios.get(
      "https://search.reservamos.mx/api/v2/places"
    );
    const cities = response.data.filter(
      (place) => place.result_type === "city"
    );

    const weatherPromises = cities.map(async (city) => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: city.city_name,
              appid: OPENWEATHER_API_KEY,
              units: "metric",
            },
          }
        );
        return {
          name: city.city_name,
          temperature: weatherResponse.data.main.temp,
          condition: weatherResponse.data.weather[0].description,
        };
      } catch (error) {
        return {
          name: city.city_name,
          temperature: null,
          condition: "Weather data unavailable",
        };
      }
    });

    const weatherData = await Promise.all(weatherPromises);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities or weather data" });
  }
});

app.get("/forecast", async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }
  try {
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    let dailyForecast = {};

    forecastResponse.data.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp_min: entry.main.temp_min,
          temp_max: entry.main.temp_max,
          condition: entry.weather[0].description,
        };
      } else {
        dailyForecast[date].temp_min = Math.min(
          dailyForecast[date].temp_min,
          entry.main.temp_min
        );
        dailyForecast[date].temp_max = Math.max(
          dailyForecast[date].temp_max,
          entry.main.temp_max
        );
      }
    });

    const forecastData = Object.entries(dailyForecast)
      .slice(0, 7)
      .map(([date, data]) => ({
        date,
        temp_min: data.temp_min,
        temp_max: data.temp_max,
        condition: data.condition,
      }));

    res.json(forecastData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
