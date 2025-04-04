import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import {
  WbSunny,
  Cloud,
  WaterDrop,
  AcUnit,
  Thunderstorm,
  Foggy,
} from "@mui/icons-material";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { AlertContext } from "../../providers/AlertProvider";

interface WeatherData {
  name: string;
  temperature: number;
  condition: conditionTypes;
}

type conditionTypes =
  | "clear sky"
  | "few clouds"
  | "scattered clouds"
  | "broken clouds"
  | "shower rain"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "mist";

const Home = () => {
  const [cities, setCities] = useState<WeatherData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setAlertMessage, setOpenAlert } = useContext(AlertContext);

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
        setAlertMessage({
          message: `Error fetching weather data:${error}`,
          type: "error",
        });
        setOpenAlert(true);
      }

      setIsLoading(false);
    };

    fetchWeather();
  }, []);

  const renderWeatherIcon = (condition: conditionTypes) => {
    switch (condition) {
      case "clear sky":
        return <WbSunny />;
      case "few clouds":
      case "broken clouds":
      case "scattered clouds":
        return <Cloud />;
      case "shower rain":
      case "rain":
        return <WaterDrop />;
      case "thunderstorm":
        return <Thunderstorm />;
      case "snow":
        return <AcUnit />;
      case "mist":
        return <Foggy />;
      default:
        return <WbSunny />;
    }
  };

  return (
    <div className={styles.container}>
      {cities && !isLoading ? (
        cities.map((city, index) => (
          <Link
            to={`/city/${city.name}`}
            className={styles.cityCardLink}
            key={city.name}
          >
            <Card className={styles.cityCard}>
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
