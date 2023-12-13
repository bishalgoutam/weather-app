import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { UtilService } from '../services/util.service';

@Injectable({
    providedIn: 'root'
})
export class StateService {

    constructor() { }

    private initialTempUnit = 'F';
    private tempUnit = new BehaviorSubject<string>(this.initialTempUnit);

    getTempUnit(): Observable<string> {
        return this.tempUnit.asObservable();
    }

    toggleTempUnit(tempUnit: string): void {
        this.tempUnit.next(tempUnit);
    }

}
