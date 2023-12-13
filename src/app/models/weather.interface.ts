export interface Weather {
  zipCode: number;
  name?: string;
  tempC: number;
  tempF: number;
  icon: string;
  forecast: string;
  tempHighC: number;
  tempLowC: number;
  tempHighF: number;
  tempLowF: number;
  date?: string;
}

export interface DetailWeather {
  name: string;
  fiveDayForecast: Weather[];
}

export interface FiveDayForecast {
  city: City;
  cnt: number;
  code: number;
  list: WeatherFromAPI[];
}

export interface City {
  name: string;
  coord: Coord;
  country: string;
  id: number;
}

export interface Coord {
  lat: number;
  lon: number;
}

export interface WeatherFromAPI {
  dt_txt?: string;
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: Main;
  name: string;
  sys: {
    country: string;
    id: number;
    message: number;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export interface Main {
  humidity: number;
  pressure: number;
  temp: number;
  temp_max: number;
  temp_min: number;
}

export interface SessionData {
  cities: Weather[];
  detail: any;
}
