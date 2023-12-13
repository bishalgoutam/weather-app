import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchService } from '../../services/fetch.service';
import { Weather, DetailWeather, FiveDayForecast, WeatherFromAPI } from '../../models/weather.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StateService } from '../../services/state.service';
import { UtilService } from '../../services/util.service';
import { log } from 'console';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  currentWeather: Weather[] = [];
  forecast?: DetailWeather;
  zipCode?: string;

  subcription: Subscription = new Subscription();
  unit: string = '';
  isLoading: boolean = false; // need to implemente

  constructor(private fetchService: FetchService,
    private route: ActivatedRoute,
    private stateService: StateService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.zipCode = params['zipCode'];
      if (this.zipCode) {
        this.fetchCurrentWeather();

        this.fetchFiveDayForecast();

      } else {
        console.log('No ZIP code provided in route parameters.');
      }
    });

    this.subcription = this.stateService.getTempUnit().subscribe(
      (res) => {
        this.unit = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  fetchCurrentWeather() {
    this.fetchService.getWeather(this.zipCode!).subscribe(
      data => {
        const cityObject = this.utilService.createCityObject(parseInt(this.zipCode!), data);
        this.currentWeather.push(cityObject);
      },
      error => console.error('Error fetching weather data:', error)
    );
  }

  fetchFiveDayForecast() {
    this.fetchService.getForecast(this.zipCode!).subscribe(
      data => {
        this.processForecastData(data);
      },
      error => console.error('Error fetching forecast:', error)
    );
  }


  processForecastData(data: FiveDayForecast) {
    const groupedByDate = this.groupForecastByDate(data.list);
  
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return dateA - dateB;
    });
    
    const forecastStartingTomorrow = sortedDates.slice(1, 6);
  
    this.forecast = {
      name: data.city.name,
      fiveDayForecast: forecastStartingTomorrow.map(date => {
        const dateData = groupedByDate[date];
        const firstItem = dateData[0];
        return {
          zipCode: data.city.id,
          name: data.city.name,
          date: new Date(firstItem.dt * 1000).toLocaleDateString(),
          tempC: parseFloat((firstItem.main.temp - 273.15).toFixed(2)),
          tempF: parseFloat(((firstItem.main.temp - 273.15) * 9 / 5 + 32).toFixed(2)),
          icon: firstItem.weather[0].icon,
          forecast: firstItem.weather[0].description,
          tempHighC: parseFloat((firstItem.main.temp_max - 273.15).toFixed(2)),
          tempLowC: parseFloat((firstItem.main.temp_min - 273.15).toFixed(2)),
          tempHighF: parseFloat(((firstItem.main.temp_max - 273.15) * 9 / 5 + 32).toFixed(2)),
          tempLowF: parseFloat(((firstItem.main.temp_min - 273.15) * 9 / 5 + 32).toFixed(2)),
        };
      })
    };
  }
  

  private groupForecastByDate(forecastData: WeatherFromAPI[]): Record<string, WeatherFromAPI[]> {
    return forecastData.reduce((acc, data) => {
      const dateKey = new Date(data.dt * 1000).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(data);
      return acc;
    }, {} as Record<string, WeatherFromAPI[]>);
  }



}
