import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Weather, WeatherFromAPI, FiveDayForecast } from '../models/weather.interface';


@Injectable({
  providedIn: 'root'
})

export class FetchService {

  BASE_URL: string = `https://api.openweathermap.org/data/2.5/weather?zip=`;
  FORECAST_URL: string = `https://api.openweathermap.org/data/2.5/forecast?zip=`;
  weatherAppKey: string = `b46b6f73920f827d7bcc206ecdbd504e`;


  constructor(private http: HttpClient) { }

  getWeather(zip: string): Observable<WeatherFromAPI> {
    const url = `${this.BASE_URL}${zip},us&appid=${this.weatherAppKey}`;
    return this.http.get<WeatherFromAPI>(url).pipe(
      tap(data => console.log('API Response:', data)),
      map(data => (data))
    );
  }

  getInitialWeather(zips: number[]): Observable<WeatherFromAPI[]> {
    const responses: Observable<WeatherFromAPI>[] = [];
    const requests = zips.map(zip => this.getWeather(zip.toString()));
    return forkJoin(requests);
  }

  getForecast(zip: string): Observable<FiveDayForecast> {
    const url = `${this.FORECAST_URL}${zip},us&appid=${this.weatherAppKey}`;
    return this.http.get<FiveDayForecast>(url).pipe(
      tap(data => console.log('API Response:', data)),
      map(data => (data))
      
    );
  }
}
