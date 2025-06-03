import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'surveys',
    loadComponent: () => import('./pages/surveys/survey-list.component').then(m => m.SurveyListComponent),
  },
  {
    path: 'surveys/create',
    loadComponent: () => import('./pages/surveys/survey-create.component').then(m => m.SurveyCreateComponent),
  },
  {
    path: 'responses',
    loadComponent: () => import('./pages/responses/response-list.component').then(m => m.ResponseListComponent),
  },
  {
    path: 'responses/:id',
    loadComponent: () => import('./pages/responses/response-detail.component').then(m => m.ResponseDetailComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

