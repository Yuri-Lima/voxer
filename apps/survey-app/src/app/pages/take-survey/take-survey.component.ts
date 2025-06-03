import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyService, SurveyTemplate } from '../../services/survey.service';

@Component({
  selector: 'app-take-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
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

      <!-- Survey Form -->
      <div *ngIf="survey && surveyForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <!-- Survey Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ survey.title }}
          </h1>
          <p *ngIf="survey.description" class="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {{ survey.description }}
          </p>
          
          <!-- Survey Info -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span *ngIf="survey.settings?.estimatedDuration" class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              {{ survey.settings.estimatedDuration }} {{ 'survey.minutes' | translate }}
            </span>
            
            <span *ngIf="survey.settings?.targetAudience" class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
              {{ survey.settings.targetAudience }}
            </span>
          </div>
        </div>

        <!-- Form -->
        <form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">
          <!-- Respondent Info (Optional) -->
          <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ 'survey.respondentInfo' | translate }}
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ 'survey.optional' | translate }})
              </span>
            </h3>
            
            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ 'survey.name' | translate }}
                </label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  [placeholder]="'survey.namePlaceholder' | translate"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ 'survey.email' | translate }}
                </label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  [placeholder]="'survey.emailPlaceholder' | translate"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ 'survey.phone' | translate }}
                </label>
                <input 
                  type="tel" 
                  formControlName="phone"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  [placeholder]="'survey.phonePlaceholder' | translate"
                >
              </div>
            </div>
          </div>

          <!-- Survey Questions -->
          <div class="space-y-8">
            <div *ngFor="let field of survey.schema.fields; let i = index" class="border-b border-gray-200 dark:border-gray-600 pb-8 last:border-b-0">
              <!-- Question Label -->
              <label class="block text-lg font-medium text-gray-900 dark:text-white mb-4">
                {{ field.label }}
                <span *ngIf="field.required" class="text-red-500">*</span>
              </label>

              <!-- Text Input -->
              <div *ngIf="field.type === 'text' || field.type === 'email'" class="mb-4">
                <input 
                  [type]="field.type"
                  [formControlName]="'answer_' + field.id"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  [placeholder]="field.placeholder || ''"
                >
              </div>

              <!-- Textarea -->
              <div *ngIf="field.type === 'textarea'" class="mb-4">
                <textarea 
                  [formControlName]="'answer_' + field.id"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  [placeholder]="field.placeholder || ''"
                  [maxlength]="field.options?.maxLength"
                ></textarea>
                <div *ngIf="field.options?.maxLength" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ surveyForm.get('answer_' + field.id)?.value?.length || 0 }} / {{ field.options.maxLength }}
                </div>
              </div>

              <!-- Multiple Choice -->
              <div *ngIf="field.type === 'multiple_choice'" class="space-y-2">
                <div *ngFor="let choice of field.options.choices" class="flex items-center">
                  <input 
                    type="radio" 
                    [id]="field.id + '_' + choice"
                    [formControlName]="'answer_' + field.id"
                    [value]="choice"
                    class="mr-3 text-blue-600"
                  >
                  <label [for]="field.id + '_' + choice" class="text-gray-900 dark:text-white">
                    {{ choice }}
                  </label>
                </div>
              </div>

              <!-- Rating -->
              <div *ngIf="field.type === 'rating'" class="mb-4">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ field.options.labels[0] }}
                  </span>
                  
                  <div class="flex space-x-2">
                    <button 
                      *ngFor="let num of getRatingNumbers(field.options.min, field.options.max)"
                      type="button"
                      (click)="setRating(field.id, num)"
                      [class]="getRatingClass(field.id, num)"
                      class="w-10 h-10 rounded-full border-2 font-semibold transition-colors duration-200"
                    >
                      {{ num }}
                    </button>
                  </div>
                  
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ field.options.labels[1] }}
                  </span>
                </div>
              </div>

              <!-- Validation Error -->
              <div *ngIf="surveyForm.get('answer_' + field.id)?.invalid && surveyForm.get('answer_' + field.id)?.touched" 
                   class="text-red-500 text-sm mt-1">
                {{ 'survey.required' | translate }}
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button 
              type="submit" 
              [disabled]="submitting || surveyForm.invalid"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span *ngIf="!submitting">{{ 'survey.submit' | translate }}</span>
              <span *ngIf="submitting" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ 'survey.submitting' | translate }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TakeSurveyComponent implements OnInit {
  survey: SurveyTemplate | null = null;
  surveyForm!: FormGroup;
  loading = true;
  submitting = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private surveyService: SurveyService
  ) {}

  ngOnInit() {
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.loadSurvey(surveyId);
    }
  }

  loadSurvey(id: string) {
    this.loading = true;
    this.error = null;

    this.surveyService.getPublicMarketSurvey(id).subscribe({
      next: (survey) => {
        if (survey) {
          this.survey = survey;
          this.buildForm();
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

  buildForm() {
    if (!this.survey) return;

    const formControls: any = {
      name: [''],
      email: [''],
      phone: ['']
    };

    // Adicionar controles para cada campo da pesquisa
    this.survey.schema.fields.forEach((field: any) => {
      const validators = field.required ? [Validators.required] : [];
      formControls[`answer_${field.id}`] = ['', validators];
    });

    this.surveyForm = this.fb.group(formControls);
  }

  getRatingNumbers(min: number, max: number): number[] {
    const numbers = [];
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  setRating(fieldId: string, value: number) {
    this.surveyForm.get(`answer_${fieldId}`)?.setValue(value);
  }

  getRatingClass(fieldId: string, value: number): string {
    const currentValue = this.surveyForm.get(`answer_${fieldId}`)?.value;
    const isSelected = currentValue === value;
    
    return isSelected 
      ? 'bg-blue-600 text-white border-blue-600' 
      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400';
  }

  onSubmit() {
    if (this.surveyForm.invalid || !this.survey) return;

    this.submitting = true;
    const formValue = this.surveyForm.value;

    // Preparar dados da resposta
    const answers: any = {};
    this.survey.schema.fields.forEach((field: any) => {
      const answerKey = `answer_${field.id}`;
      if (formValue[answerKey] !== null && formValue[answerKey] !== '') {
        answers[field.id] = formValue[answerKey];
      }
    });

    // Preparar informações do respondente
    const respondentInfo: any = {};
    if (formValue.name) respondentInfo.name = formValue.name;
    if (formValue.email) respondentInfo.email = formValue.email;
    if (formValue.phone) respondentInfo.phone = formValue.phone;

    const submitData = {
      templateId: this.survey.id,
      answers,
      respondentInfo: Object.keys(respondentInfo).length > 0 ? respondentInfo : undefined,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        language: navigator.language
      }
    };

    this.surveyService.submitMarketSurvey(submitData).subscribe({
      next: (response) => {
        console.log('Survey submitted successfully:', response);
        this.router.navigate(['/survey', this.survey!.id, 'success']);
      },
      error: (error) => {
        console.error('Error submitting survey:', error);
        this.error = error.message || 'Failed to submit survey';
        this.submitting = false;
      }
    });
  }
}

