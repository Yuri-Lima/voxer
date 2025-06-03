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
    path: 'surveys/:id',
    loadComponent: () => import('./pages/surveys/survey-detail.component').then(m => m.SurveyDetailComponent),
  },
  {
    path: 'surveys/:id/edit',
    loadComponent: () => import('./pages/surveys/survey-edit.component').then(m => m.SurveyEditComponent),
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
    path: 'users',
    loadComponent: () => import('./pages/users/user-list.component').then(m => m.UserListComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

