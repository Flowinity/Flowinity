import { gql } from "@apollo/client";

export const WeatherQuery = gql`
  query Weather {
    weather {
      temp
      feels_like
      temp_min
      temp_max
      pressure
      humidity
      wind_speed
      wind_deg
      clouds
      visibility
      error
      cached
      icon
      main
      description
      location
      wind_gust
      sunset
      sunrise
      rain_1h
    }
  }
`;
