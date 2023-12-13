import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Weather } from '../../models/weather.interface';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent  {
  @Input() cities: Weather[] = [];
  @Output() zipSearch = new EventEmitter<string>();
  @Output() zipDelete = new EventEmitter<string>();

  unit: string = '';
  isLoading: boolean = true; 

  formGroup: FormGroup;
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private stateService: StateService) {
    this.formGroup = this.fb.group({
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }


  addCity() {
    if (this.formGroup.valid) {
      this.zipSearch.emit(this.formGroup.value.zipCode);
      this.formGroup.reset();
    }
  }
  
  deleteCity(zipCode: string) {
    this.zipDelete.emit(zipCode);
  }
  


  ngOnInit() {
    this.subscription = this.stateService.getTempUnit().subscribe(
      (res) => {
        this.unit = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    // this.isLoading = false;
  }
}