interface WeatherData {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number; // UTC Unix
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface WeatherForecastFiveDays {
  city: City;
  cnt: number;
  cod: string;
  list: Item0[];
  message: number;
}

interface Coord {
  lon: number;
  lat: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feelsLike: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  seaLevel: number;
  grndLevel: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Clouds {
  all: number;
}

interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface City {
  coord: Coord;
  country: string;
  id: number;
  name: string;
  population: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

interface Item0 {
  clouds: Clouds;
  dt: number;
  dt_txt: string;
  main: Main;
  pop: number;
  rain: Rain;
  sys: Sys;
  visibility: number;
  weather: Weather[];
  wind: Wind;
}

interface Rain {
  the3H: number;
}

interface CustomSaveDTO {
  city: string;
  temp: number;
  date: number; //  Unix timestamp
  skyStateDescription: string;
  iconId: string;
  visibility: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  clouds: number;
  lon: number;
  lat: number;
  list: Item0[];
}
