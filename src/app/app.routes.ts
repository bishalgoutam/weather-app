import { Routes, RouterModule } from '@angular/router';

import { DetailComponent } from './components/detail/detail.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', title: "Home", component: HomeComponent, },
    { path: 'detail/:zipCode', title: 'Detail', component: DetailComponent, }
];