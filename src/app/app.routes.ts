import { Routes } from '@angular/router';
import { AppComponent } from './components/app-component/app-component';

export const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':filter', component: AppComponent },
];
