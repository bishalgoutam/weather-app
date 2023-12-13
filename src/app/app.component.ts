import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HomeComponent } from './components/home/home.component';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  
    CommonModule, 
    RouterOutlet, 
    HomeComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  pageTitle: string = 'MyWeather';
  title = 'MyWeather';
  isUsingF: boolean;
  

  constructor(private stateService: StateService) {
    this.isUsingF = true; // Initial unit is Fahrenheit
  }

  selectCelsius() {
    this.stateService.toggleTempUnit('C');
    this.isUsingF = false;
  }

  selectFahrenheit() {
    this.stateService.toggleTempUnit('F');
    this.isUsingF = true;
  }
}
