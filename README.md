
# Interurban-Challenge

## Backend with AI

Prompt:
`create an endpoint which list all the cities using this endpoint "https://search.reservamos.mx/api/v2/places" filter just result_type="city"`

Prompt update:
`then call a service to the OpenWeather api to get each city weather information and just return name of the city, temperature and weather condition`

Result:

```
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = 'your_openweather_api_key'; // Replace with your actual API key

app.get('/cities', async (req, res) => {
    try {
        const response = await axios.get('https://search.reservamos.mx/api/v2/places');
        const cities = response.data.filter((place: any) => place.result_type === 'city');

        const weatherPromises = cities.map(async (city: any) => {
            try {
                const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: {
                        q: city.city_name,
                        appid: OPENWEATHER_API_KEY,
                        units: 'metric'
                    }
                });
                return {
                    name: city.city_name,
                    temperature: weatherResponse.data.main.temp,
                    condition: weatherResponse.data.weather[0].description
                };
            } catch (error) {
                return { name: city.city_name, temperature: null, condition: 'Weather data unavailable' };
            }
        });

        const weatherData = await Promise.all(weatherPromises);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cities or weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

```


Prompt:
`create an endpoint which i can send a city name and it returns the next 7 days weather only date, temperature min and max, and weather condition.`

Result:

```
app.get('/forecast', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily`, {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                cnt: 7
            }
        });
        const forecastData = forecastResponse.data.list.map((day: any) => ({
            date: new Date(day.dt * 1000).toISOString().split('T')[0],
            temp_min: day.temp.min,
            temp_max: day.temp.max,
            condition: day.weather[0].description
        }));
        res.json(forecastData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

```

prompt: `can u use forecast endpoint instead of forecast/daily?`

```
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

```