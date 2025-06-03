import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyService, SurveyTemplate } from '../../services/survey.service';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div>
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ 'surveys.title' | translate }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ 'surveys.subtitle' | translate }}
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          {{ 'common.loading' | translate }}
        </p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
        <p>{{ 'surveys.error' | translate }}: {{ error }}</p>
      </div>

      <!-- Surveys Grid -->
      <div *ngIf="!loading && !error" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let survey of surveys" 
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          <!-- Survey Card -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ survey.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ survey.description || ('surveys.noDescription' | translate) }}
            </p>

            <!-- Survey Meta -->
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                {{ survey.type | titlecase }}
              </span>
              
              <span *ngIf="survey.settings?.estimatedDuration">
                {{ survey.settings.estimatedDuration }} {{ 'surveys.minutes' | translate }}
              </span>
            </div>

            <!-- Target Audience -->
            <div *ngIf="survey.settings?.targetAudience" class="mb-4">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ 'surveys.targetAudience' | translate }}:
              </span>
              <span class="text-sm text-gray-700 dark:text-gray-300 ml-1">
                {{ survey.settings.targetAudience }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <a 
                [routerLink]="['/survey', survey.id]"
                class="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
              >
                {{ 'surveys.viewDetails' | translate }}
              </a>
              
              <a 
                [routerLink]="['/survey', survey.id, 'take']"
                class="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200"
              >
                {{ 'surveys.takeSurvey' | translate }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && surveys.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ 'surveys.noSurveys' | translate }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ 'surveys.noSurveysDescription' | translate }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class SurveyListComponent implements OnInit {
  surveys: SurveyTemplate[] = [];
  loading = true;
  error: string | null = null;

  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    this.loadSurveys();
  }

  loadSurveys() {
    this.loading = true;
    this.error = null;

    this.surveyService.getPublicMarketSurveys().subscribe({
      next: (surveys) => {
        this.surveys = surveys;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading surveys:', error);
        this.error = error.message || 'Failed to load surveys';
        this.loading = false;
      }
    });
  }
}

