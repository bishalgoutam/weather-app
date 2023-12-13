import { Component, OnInit, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Weather } from '../../models/weather.interface';
import { FetchService } from '../../services/fetch.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { UtilService } from '../../services/util.service';

import { isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  cities: Weather[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fetchService: FetchService,
    private localStorageService: LocalStorageService,
    private utilService: UtilService
  ) {
    afterNextRender(() => {
      console.log('constructure', this.platformId, localStorage.getItem('token'));
    });
  }

  ngOnInit() {
    // this.loadSavedLocations();
    // this.initializeWeatherData();
    if (isPlatformBrowser(this.platformId)) {
      this.loadSavedLocations();
    } else {
      console.log('Running on the server, localStorage will not be available');
      // this.initializeWeatherData(); 
    }
  }

  loadSavedLocations() {
    const savedLocations = this.localStorageService.getItem<number[]>('savedLocations');
    if (savedLocations && savedLocations.length > 0) {
      const weatherObservables = savedLocations.map(zipCode =>
        this.fetchService.getWeather(zipCode.toString())
      );

      forkJoin(weatherObservables).subscribe(responses => {
        this.cities = responses.map((data, index) => {
          return this.utilService.createCityObject(savedLocations[index], data);
        });
      });
    } else {
      this.initializeWeatherData();
    }
  }

  saveLocationsToLocalStorage() {
    const savedLocations = this.cities.map(city => city.zipCode);
    this.localStorageService.setItem('savedLocations', savedLocations);
  }

  initializeWeatherData() {
    const defaultZipCodes = [33101, 43016, 98101, 90001]; // Replace with desired ZIP codes
    this.fetchService.getInitialWeather(defaultZipCodes).subscribe(weatherData => {
      this.cities = weatherData.map((data, index) =>
        this.utilService.createCityObject(defaultZipCodes[index], data)
      );
    });
  }


  addCityWeather(zip: string) {
    const zipCode = parseInt(zip, 10);
    const cityExists = this.cities.some(city => city.zipCode === zipCode);
    if (cityExists) {
      return;
    }
    this.fetchService.getWeather(zip).subscribe(data => {
      const newCity = this.utilService.createCityObject(zipCode, data);
      this.cities.push(newCity);

      this.saveLocationsToLocalStorage();
    });
  }


  deleteCity(zipCode: string) {
    const zip = parseInt(zipCode, 10);
    const index = this.cities.findIndex(city => city.zipCode === zip);
    if (index !== -1) {
      this.cities.splice(index, 1);
    }
    this.saveLocationsToLocalStorage();
  }

};
