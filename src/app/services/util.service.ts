import { Injectable } from '@angular/core';
import { WeatherFromAPI, Weather, SessionData } from '../models/weather.interface';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    kelvinUnitTransform(type: string, kelvin: number): number {
        if (type === 'f') {
            // Convert Kelvin to Fahrenheit
            return parseFloat(((kelvin - 273.15) * 9 / 5 + 32).toFixed(2));
        } else if (type === 'c') {
            // Convert Kelvin to Celsius
            return parseFloat((kelvin - 273.15).toFixed(2));
        }
        return kelvin;
    }

    createCityObject(zipCode: number, data: any): Weather {
        let cityName = data.name;
        if (cityName.startsWith('"') && cityName.endsWith('"')) {
            cityName = cityName.slice(1, -1);
        }
        return {
            zipCode: zipCode,
            name: cityName,
            tempF: this.kelvinUnitTransform('f', data.main.temp),
            tempC: this.kelvinUnitTransform('c', data.main.temp),
            icon: data.weather[0].icon,
            forecast: data.weather[0].description,
            tempHighF: this.kelvinUnitTransform('f', data.main.temp_max),
            tempHighC: this.kelvinUnitTransform('c', data.main.temp_max),
            tempLowF: this.kelvinUnitTransform('f', data.main.temp_min),
            tempLowC: this.kelvinUnitTransform('c', data.main.temp_min),
        };
    }




}
