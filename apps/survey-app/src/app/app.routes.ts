import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'surveys',
    loadComponent: () => import('./pages/survey-list/survey-list.component').then(m => m.SurveyListComponent),
  },
  {
    path: 'survey/:id',
    loadComponent: () => import('./pages/survey-detail/survey-detail.component').then(m => m.SurveyDetailComponent),
  },
  {
    path: 'survey/:id/take',
    loadComponent: () => import('./pages/take-survey/take-survey.component').then(m => m.TakeSurveyComponent),
  },
  {
    path: 'survey/:id/success',
    loadComponent: () => import('./pages/survey-success/survey-success.component').then(m => m.SurveySuccessComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

