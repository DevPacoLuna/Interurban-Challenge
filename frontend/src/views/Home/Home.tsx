import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { WbSunny, Cloud, InvertColors } from "@mui/icons-material";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

// Define types for the city and weather response
interface WeatherData {
  name: string;
  temperature: number;
  condition: string;
}

const Home = () => {
  const [cities, setCities] = useState<WeatherData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<WeatherData[]>(
          `${process.env.REACT_APP_BACKEND_API_URL}/cities`
        );

        if (response.status === 200) {
          setCities(response.data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }

      setIsLoading(false);
    };

    fetchWeather();
  }, []);

  const renderWeatherIcon = (condition: string) => {
    switch (condition) {
      case "clear sky":
        return <WbSunny />;
      case "clouds":
        return <Cloud />;
      case "rain":
        return <InvertColors />;
      default:
        return <WbSunny />;
    }
  };

  return (
    <div className={styles.container}>
      {cities && !isLoading ? (
        cities.map((city, index) => (
          <Link to={`/city/${city.name}`} className={styles.cityCardLink}>
            <Card key={city.name} className={styles.cityCard}>
              <CardContent>
                <Typography className={styles.cityName}>{city.name}</Typography>
                <div className={styles.weatherInfo}>
                  <div className={styles.cardIcon}>
                    {renderWeatherIcon(city.condition)}
                  </div>
                  <Typography className={styles.temperature}>
                    {city.temperature}°C
                  </Typography>
                  <Typography className={styles.weatherCondition}>
                    {city.condition}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Home;
