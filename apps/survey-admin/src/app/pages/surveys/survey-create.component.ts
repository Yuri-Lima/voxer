import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { AdminService, CreateSurveyTemplateInput } from '../../services/admin.service';

@Component({
  selector: 'app-survey-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, FormlyModule, FormlyPrimeNGModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ 'admin.surveys.create.title' | translate }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          {{ 'admin.surveys.create.subtitle' | translate }}
        </p>
      </div>

      <!-- Survey Creation Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Basic Information -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ 'admin.surveys.create.basicInfo' | translate }}
            </h3>
            <formly-form [form]="form" [fields]="basicFields" [model]="model"></formly-form>
          </div>

          <!-- Survey Fields -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ 'admin.surveys.create.fields' | translate }}
              </h3>
              <button 
                type="button"
                (click)="addField()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {{ 'admin.surveys.create.addField' | translate }}
              </button>
            </div>

            <!-- Survey Fields List -->
            <div class="space-y-4">
              <div *ngFor="let field of surveyFields; let i = index" 
                   class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ 'admin.surveys.create.field' | translate }} {{ i + 1 }}
                  </h4>
                  <button 
                    type="button"
                    (click)="removeField(i)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>

                <!-- Field Configuration -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ 'admin.surveys.create.fieldLabel' | translate }}
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="field.label"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      [placeholder]="'admin.surveys.create.fieldLabelPlaceholder' | translate"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {{ 'admin.surveys.create.fieldType' | translate }}
                    </label>
                    <select 
                      [(ngModel)]="field.type"
                      (change)="onFieldTypeChange(field)"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="text">{{ 'admin.surveys.create.fieldTypes.text' | translate }}</option>
                      <option value="email">{{ 'admin.surveys.create.fieldTypes.email' | translate }}</option>
                      <option value="textarea">{{ 'admin.surveys.create.fieldTypes.textarea' | translate }}</option>
                      <option value="multiple_choice">{{ 'admin.surveys.create.fieldTypes.multipleChoice' | translate }}</option>
                      <option value="rating">{{ 'admin.surveys.create.fieldTypes.rating' | translate }}</option>
                    </select>
                  </div>

                  <div class="md:col-span-2">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        [(ngModel)]="field.required"
                        class="mr-2"
                      >
                      <span class="text-sm text-gray-700 dark:text-gray-300">
                        {{ 'admin.surveys.create.required' | translate }}
                      </span>
                    </label>
                  </div>

                  <!-- Multiple Choice Options -->
                  <div *ngIf="field.type === 'multiple_choice'" class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ 'admin.surveys.create.choices' | translate }}
                    </label>
                    <div class="space-y-2">
                      <div *ngFor="let choice of field.options?.choices; let j = index" class="flex items-center">
                        <input 
                          type="text" 
                          [(ngModel)]="field.options.choices[j]"
                          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          [placeholder]="'admin.surveys.create.choicePlaceholder' | translate"
                        >
                        <button 
                          type="button"
                          (click)="removeChoice(field, j)"
                          class="ml-2 text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                          </svg>
                        </button>
                      </div>
                      <button 
                        type="button"
                        (click)="addChoice(field)"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                      >
                        + {{ 'admin.surveys.create.addChoice' | translate }}
                      </button>
                    </div>
                  </div>

                  <!-- Rating Options -->
                  <div *ngIf="field.type === 'rating'" class="md:col-span-2">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {{ 'admin.surveys.create.minRating' | translate }}
                        </label>
                        <input 
                          type="number" 
                          [(ngModel)]="field.options.min"
                          min="0"
                          max="10"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {{ 'admin.surveys.create.maxRating' | translate }}
                        </label>
                        <input 
                          type="number" 
                          [(ngModel)]="field.options.max"
                          min="1"
                          max="10"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="surveyFields.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                {{ 'admin.surveys.create.noFields' | translate }}
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              (click)="goBack()"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {{ 'common.cancel' | translate }}
            </button>
            
            <button 
              type="submit" 
              [disabled]="submitting || !isFormValid()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span *ngIf="!submitting">{{ 'admin.surveys.create.submit' | translate }}</span>
              <span *ngIf="submitting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ 'admin.surveys.create.submitting' | translate }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SurveyCreateComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  submitting = false;

  basicFields: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      templateOptions: {
        label: 'Survey Title',
        placeholder: 'Enter survey title',
        required: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description',
        placeholder: 'Enter survey description',
        rows: 3,
      },
    },
    {
      key: 'type',
      type: 'select',
      templateOptions: {
        label: 'Survey Type',
        required: true,
        options: [
          { value: 'MARKET_RESEARCH', label: 'Market Research' },
          { value: 'CUSTOMER_FEEDBACK', label: 'Customer Feedback' },
          { value: 'EMPLOYEE_SURVEY', label: 'Employee Survey' },
          { value: 'ACADEMIC_RESEARCH', label: 'Academic Research' },
        ],
      },
    },
    {
      key: 'isPublic',
      type: 'checkbox',
      templateOptions: {
        label: 'Make this survey public',
      },
    },
  ];

  surveyFields: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize with default values
    this.model = {
      title: '',
      description: '',
      type: 'MARKET_RESEARCH',
      isPublic: true,
    };
  }

  addField() {
    const newField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: {},
    };
    this.surveyFields.push(newField);
  }

  removeField(index: number) {
    this.surveyFields.splice(index, 1);
  }

  onFieldTypeChange(field: any) {
    // Reset options when type changes
    field.options = {};
    
    if (field.type === 'multiple_choice') {
      field.options.choices = [''];
    } else if (field.type === 'rating') {
      field.options.min = 1;
      field.options.max = 5;
      field.options.labels = ['Poor', 'Excellent'];
    }
  }

  addChoice(field: any) {
    if (!field.options.choices) {
      field.options.choices = [];
    }
    field.options.choices.push('');
  }

  removeChoice(field: any, index: number) {
    field.options.choices.splice(index, 1);
  }

  isFormValid(): boolean {
    return this.form.valid && 
           this.model.title && 
           this.model.type && 
           this.surveyFields.length > 0 &&
           this.surveyFields.every(field => field.label && field.type);
  }

  onSubmit() {
    if (!this.isFormValid() || this.submitting) return;

    this.submitting = true;

    // Prepare survey schema
    const schema = {
      fields: this.surveyFields.map(field => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
      })),
    };

    const input: CreateSurveyTemplateInput = {
      title: this.model.title,
      description: this.model.description,
      type: this.model.type,
      schema,
      isPublic: this.model.isPublic,
      settings: {
        createdBy: 'admin',
        estimatedDuration: Math.max(2, this.surveyFields.length * 0.5), // Estimate 30 seconds per field
      },
    };

    this.adminService.createSurveyTemplate(input).subscribe({
      next: (survey) => {
        console.log('Survey created successfully:', survey);
        this.router.navigate(['/surveys', survey.id]);
      },
      error: (error) => {
        console.error('Error creating survey:', error);
        this.submitting = false;
        // TODO: Show error message to user
      }
    });
  }

  goBack() {
    this.router.navigate(['/surveys']);
  }
}

