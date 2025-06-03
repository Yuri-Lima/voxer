import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyService, SurveyTemplate, SurveyStats } from '../../services/survey.service';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          {{ 'common.loading' | translate }}
        </p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
        <p>{{ 'survey.error' | translate }}: {{ error }}</p>
      </div>

      <!-- Survey Details -->
      <div *ngIf="survey" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <h1 class="text-3xl font-bold mb-4">{{ survey.title }}</h1>
          <p *ngIf="survey.description" class="text-xl opacity-90">
            {{ survey.description }}
          </p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <!-- Survey Info -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ 'survey.details.info' | translate }}
              </h3>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.type' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ survey.type | titlecase }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.status' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ survey.status | titlecase }}</span>
                </div>
                
                <div *ngIf="survey.settings?.estimatedDuration" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.duration' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ survey.settings.estimatedDuration }} {{ 'survey.minutes' | translate }}</span>
                </div>
                
                <div *ngIf="survey.settings?.targetAudience" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.audience' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ survey.settings.targetAudience }}</span>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div *ngIf="stats" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ 'survey.details.statistics' | translate }}
              </h3>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.totalResponses' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ stats.totalResponses }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.completedResponses' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ stats.completedResponses }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ 'survey.details.avgTime' | translate }}:</span>
                  <span class="text-gray-900 dark:text-white">{{ formatTime(stats.averageCompletionTime) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Survey Preview -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ 'survey.details.preview' | translate }}
            </h3>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div class="space-y-4">
                <div *ngFor="let field of survey.schema.fields; let i = index" class="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                  <div class="flex items-start">
                    <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded mr-3 mt-1">
                      {{ i + 1 }}
                    </span>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ field.label }}
                        <span *ngIf="field.required" class="text-red-500 ml-1">*</span>
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ 'survey.fieldTypes.' + field.type | translate }}
                      </p>
                      
                      <!-- Show options for multiple choice -->
                      <div *ngIf="field.type === 'multiple_choice' && field.options?.choices" class="mt-2">
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ 'survey.details.options' | translate }}:
                          <span *ngFor="let choice of field.options.choices; let last = last">
                            {{ choice }}<span *ngIf="!last">, </span>
                          </span>
                        </div>
                      </div>
                      
                      <!-- Show rating scale -->
                      <div *ngIf="field.type === 'rating' && field.options" class="mt-2">
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ 'survey.details.scale' | translate }}: {{ field.options.min }} - {{ field.options.max }}
                          <span *ngIf="field.options.labels">
                            ({{ field.options.labels[0] }} → {{ field.options.labels[1] }})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <a 
              [routerLink]="['/survey', survey.id, 'take']"
              class="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              {{ 'survey.takeSurvey' | translate }}
            </a>
            
            <a 
              routerLink="/surveys"
              class="flex-1 bg-gray-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
            >
              {{ 'survey.backToList' | translate }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SurveyDetailComponent implements OnInit {
  survey: SurveyTemplate | null = null;
  stats: SurveyStats | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.loadSurvey(surveyId);
      this.loadStats(surveyId);
    }
  }

  loadSurvey(id: string) {
    this.loading = true;
    this.error = null;

    this.surveyService.getPublicMarketSurvey(id).subscribe({
      next: (survey) => {
        if (survey) {
          this.survey = survey;
        } else {
          this.error = 'Survey not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading survey:', error);
        this.error = error.message || 'Failed to load survey';
        this.loading = false;
      }
    });
  }

  loadStats(id: string) {
    this.surveyService.getMarketSurveyStats(id).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Não mostrar erro para estatísticas, apenas não exibir
      }
    });
  }

  formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
  }
}

