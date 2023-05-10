export interface WeatherResponse {
  temp?: number
  feels_like?: number
  temp_min?: number
  temp_max?: number
  pressure?: number
  humidity?: number
  wind_speed?: number
  wind_deg?: number
  clouds?: number
  visibility?: number
  error?: boolean
  cached?: boolean
}
