import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import styles from "./CityDetails.module.scss";

interface ForecastData {
  date: string;
  temp_min: number;
  temp_max: number;
  condition: string;
}

const CityDetails = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [forecast, setForecast] = useState<ForecastData[]>();
  const [cityImage, setCityImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/forecast?city=${cityName}`
        );

        const data = weatherResponse.data;
        setForecast(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setIsLoading(false);
      }
    };

    const fetchCityImage = async () => {
      try {
        const imageResponse = await axios.get(
          `https://api.unsplash.com/photos/random?query=${cityName}`,
          {
            headers: {
              Authorization:
                "Client-ID " + process.env.REACT_APP_UNSPLASH_API_KEY,
            },
          }
        );
        const imageUrl = imageResponse.data?.urls?.regular;

        setCityImage(imageUrl || "");
      } catch (error) {
        console.error("Error fetching city image:", error);
      }
    };

    if (cityName) {
      fetchWeatherData();
      fetchCityImage();
    }
  }, [cityName]);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {cityImage && (
            <img
              src={cityImage}
              alt={`${cityName}`}
              className={styles.cityImage}
            />
          )}
          <Typography className={styles.cityName}>{cityName}</Typography>

          <div className={styles.weatherDetails}>
            {forecast?.map((day, index) => (
              <Card key={index} className={styles.weatherCard}>
                <CardContent>
                  <Typography className={styles.day}>{day.date}</Typography>
                  <Typography className={styles.temperatureRange}>
                    {day.temp_min}°C - {day.temp_max}°C
                  </Typography>
                  <Typography className={styles.weatherCondition}>
                    {day.condition}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CityDetails;
