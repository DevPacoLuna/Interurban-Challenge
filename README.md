
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


## Frontend

prompt: `create route system to 4 views sign in, sign up, list of cities as home and show each city`

result: 
```
  <Router>
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/city/:cityName" element={<CityDetails />} />
    </Routes>
  </Router>
```

prompt: `create an alert provider to show alerts on top of page with MUI`

result:
```
import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Create a context for alerts
const AlertContext = createContext();

// Custom hook to use the Alert context
export const useAlert = () => {
  return useContext(AlertContext);
};

// Alert Provider to wrap around your application
export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  // Function to trigger alert
  const showAlert = (message, severity = 'info') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  // Close alert
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
```

`PS: I change this code to have a better managment`

Prompt: `create a signup and signin in the same component using formik and mui to make it responsive and organized`

result:
```
import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box, Paper, Container } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schemas for Sign In and Sign Up forms
const signUpValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const signInValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignUpSignIn = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  // Form submit handler for Sign Up and Sign In
  const handleSubmit = (values) => {
    console.log('Form Submitted:', values);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ padding: 3, marginTop: 5 }} elevation={3}>
        <Typography variant="h4" gutterBottom>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={isSignUp ? signUpValidationSchema : signInValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Email Field */}
                <Grid item xs={12}>
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                    error={Boolean(<ErrorMessage name="email" />)}
                  />
                </Grid>

                {/* Password Field */}
                <Grid item xs={12}>
                  <Field
                    name="password"
                    as={TextField}
                    label="Password"
                    fullWidth
                    type="password"
                    variant="outlined"
                    helperText={<ErrorMessage name="password" />}
                    error={Boolean(<ErrorMessage name="password" />)}
                  />
                </Grid>

                {/* Confirm Password Field (Only for Sign Up) */}
                {isSignUp && (
                  <Grid item xs={12}>
                    <Field
                      name="confirmPassword"
                      as={TextField}
                      label="Confirm Password"
                      fullWidth
                      type="password"
                      variant="outlined"
                      helperText={<ErrorMessage name="confirmPassword" />}
                      error={Boolean(<ErrorMessage name="confirmPassword" />)}
                    />
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Button>
                </Grid>

                {/* Toggle between Sign In / Sign Up */}
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default SignUpSignIn;
```

`PS I have to change a little sections because Im using typescript`

prompt: `give me the styles but with scss module`

result:
```
.container {
  min-height: 100vh;
  background-image: url('https://source.unsplash.com/random');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.paper {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background-color: #1976d2; /* Replace with theme primary color */
}

.title {
  margin-bottom: 2rem;
  text-align: center;
  color: #1976d2; /* Replace with theme primary color */
}

.formField {
  margin-bottom: 1.5rem;
}

.submitButton {
  margin-top: 1rem;
}

.toggleButton {
  text-align: center;
  margin-top: 1rem;
  display: block;
}
```

prompt: `create a home page where shows a list of cities with it current weather im showing name of each city, temperature and weather condition, make it with MUI, Typescript and use Saas modules to make it beautiful`

```
/* HomePage.module.scss */

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem;
}

.cityCard {
  width: 300px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
}

.cityName {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 1rem;
}

.weatherInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
}

.weatherCondition {
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
}

.cardIcon {
  font-size: 3rem;
  color: #1976d2;
  margin-bottom: 1rem;
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { WiDaySunny, WiCloud, WiRain } from 'react-icons/wi';
import styles from './HomePage.module.scss';

// Define types for the city and weather response
interface WeatherData {
  main: {
    temp: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
}

interface CityWeather {
  name: string;
  weatherData?: WeatherData;
  isLoading: boolean;
}

const HomePage: React.FC = () => {
  const [cities, setCities] = useState<CityWeather[]>([
    { name: 'New York', isLoading: true },
    { name: 'London', isLoading: true },
    { name: 'Tokyo', isLoading: true },
    { name: 'Sydney', isLoading: true },
    { name: 'Paris', isLoading: true },
  ]);

  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

  useEffect(() => {
    const fetchWeather = async (city: string, index: number) => {
      try {
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        setCities((prevCities) =>
          prevCities.map((city, i) =>
            i === index ? { ...city, weatherData: response.data, isLoading: false } : city
          )
        );
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setCities((prevCities) =>
          prevCities.map((city, i) =>
            i === index ? { ...city, isLoading: false } : city
          )
        );
      }
    };

    cities.forEach((city, index) => {
      if (city.isLoading) {
        fetchWeather(city.name, index);
      }
    });
  }, [cities, apiKey]);

  const renderWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear sky':
        return <WiDaySunny />;
      case 'clouds':
        return <WiCloud />;
      case 'rain':
        return <WiRain />;
      default:
        return <WiDaySunny />;
    }
  };

  return (
    <div className={styles.container}>
      {cities.map((city, index) => (
        <Card key={city.name} className={styles.cityCard}>
          <CardContent>
            <Typography className={styles.cityName}>{city.name}</Typography>
            {city.isLoading ? (
              <CircularProgress />
            ) : (
              city.weatherData && (
                <div className={styles.weatherInfo}>
                  <div className={styles.cardIcon}>{renderWeatherIcon(city.weatherData.weather[0].description)}</div>
                  <Typography className={styles.temperature}>
                    {city.weatherData.main.temp}°C
                  </Typography>
                  <Typography className={styles.weatherCondition}>
                    {city.weatherData.weather[0].description}
                  </Typography>
                </div>
              )
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
```

prompt: `fix cors on express`

```
// npm install cors

const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// OR specify more specific CORS options (e.g., only allow certain origins):
app.use(cors({
  origin: 'http://example.com', // allow only this domain
  methods: ['GET', 'POST'],     // allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allow specific headers
}));

// Define your routes here
app.get('/', (req, res) => {
  res.send('Hello World');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```