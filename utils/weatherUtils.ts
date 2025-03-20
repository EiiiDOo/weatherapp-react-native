import { TemperatureUnit } from "@/constants/enums";
import { format } from "date-fns";

export function toCustomSave(
  weather: WeatherData,
  forecast: WeatherForecastFiveDays
): CustomSaveDTO {
  return {
    city: weather.name,
    temp: weather.main.temp,
    date: weather.dt,
    skyStateDescription: weather.weather[0].description,
    iconId: weather.weather[0].icon,
    visibility: weather.visibility,
    windSpeed: weather.wind.speed,
    humidity: weather.main.humidity,
    pressure: weather.main.pressure,
    clouds: weather.clouds.all,
    lon: weather.coord.lon,
    lat: weather.coord.lat,
    list: forecast.list,
  };
}
export function convertUnixToDay(
  unixTimestamp: number,
  formatString: string
): string {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  return format(date, formatString);
}

// Define a mapping of icon codes to image paths using require
const imageMap: { [key: string]: any } = {
  "01d": require("../assets/icons/img_sun.png"),
  "01n": require("../assets/icons/img_moon.png"),
  "02d": require("../assets/icons/img_sun_clouds.png"),
  "02n": require("../assets/icons/img_moon_clouds.png"),
  "03d": require("../assets/icons/img_clouds.png"),
  "03n": require("../assets/icons/img_clouds.png"),
  "04d": require("../assets/icons/img_broken.png"),
  "04n": require("../assets/icons/img_broken.png"),
  "09d": require("../assets/icons/img_rainy.png"),
  "09n": require("../assets/icons/img_rainy.png"),
  "10d": require("../assets/icons/img_moon_clouds_rain.png"),
  "10n": require("../assets/icons/img_moon_clouds_rain.png"),
  "11d": require("../assets/icons/img_storm.png"),
  "11n": require("../assets/icons/img_storm.png"),
  "13d": require("../assets/icons/img_clouds_snow.png"),
  "13n": require("../assets/icons/img_clouds_snow.png"),
  "50d": require("../assets/icons/img_mist.png"),
  "50n": require("../assets/icons/img_mist.png"),
  default: require("../assets/icons/img_clouds.png"),
};

// Function to get the image path based on the icon code
export function getImagePath(iconCode: string): any {
  return imageMap[iconCode] || imageMap["default"];
}

// Define a mapping of icon codes to image paths using require
const imageMap2X: { [key: string]: any } = {
  "01d": require("../assets/icons/img_sun_2x.png"),
  "01n": require("../assets/icons/img_moon_2x.png"),
  "02d": require("../assets/icons/img_moon_clouds_2x.png"),
  "02n": require("../assets/icons/img_moon_clouds_2x.png"),
  "03d": require("../assets/icons/img_clouds_2x.png"),
  "03n": require("../assets/icons/img_clouds_2x.png"),
  "04d": require("../assets/icons/img_broken_2x.png"),
  "04n": require("../assets/icons/img_broken_2x.png"),
  "09d": require("../assets/icons/img_rainy_2x.png"),
  "09n": require("../assets/icons/img_rainy_2x.png"),
  "10d": require("../assets/icons/img_sun_clouds_rain_2x.png"),
  "10n": require("../assets/icons/img_moon_clouds_rain_2x.png"),
  "11d": require("../assets/icons/img_storm_2x.png"),
  "11n": require("../assets/icons/img_storm_2x.png"),
  "13d": require("../assets/icons/img_clouds_snow_2x.png"),
  "13n": require("../assets/icons/img_clouds_snow_2x.png"),
  "50d": require("../assets/icons/img_mist_2x.png"),
  "50n": require("../assets/icons/img_mist_2x.png"),
  default: require("../assets/icons/img_sun_clouds_2x.png"),
};

// Function to get the image path based on the icon code
export function getImagePath2X(iconCode: string): any {
  return imageMap2X[iconCode] || imageMap2X["default"];
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function celsiusToKelvin(celsius: number): number {
  return Math.round(celsius + 273.15);
}
export function getUnitSymbol(unit: TemperatureUnit): string {
  switch (unit) {
    case TemperatureUnit.Celsius:
      return "°C";
    case TemperatureUnit.Fahrenheit:
      return "F";
    case TemperatureUnit.Kelvin:
      return "K";
    default:
      throw new Error("Invalid temperature unit");
  }
}
export function convertTemperature(
  tempInCelsius: number,
  unit: TemperatureUnit
): number {
  switch (unit) {
    case TemperatureUnit.Celsius:
      return Math.round(tempInCelsius);
    case TemperatureUnit.Fahrenheit:
      return celsiusToFahrenheit(tempInCelsius);
    case TemperatureUnit.Kelvin:
      return celsiusToKelvin(tempInCelsius);
    default:
      throw Error("Error: Invalid temperature unit");
  }
}

export function getFiveDay(list: Item0[]): Item0[] {
  return list.filter((_, index) => index % 8 === 0);
}

export function toMilesPerHour(speed: number): number {
  const conversionFactor = 2.23694;
  return Math.round(speed * conversionFactor * 100) / 100;
}
