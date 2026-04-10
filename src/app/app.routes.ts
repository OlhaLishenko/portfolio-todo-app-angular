import { Routes } from '@angular/router';
import { TodoApp } from './components/todo-app/todo-app';

export const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':filter', component: TodoApp },
];
