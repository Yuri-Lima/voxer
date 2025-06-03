import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-survey-success',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="max-w-2xl mx-auto text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ 'success.title' | translate }}
        </h1>
        
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {{ 'success.message' | translate }}
        </p>
      </div>

      <!-- Thank You Message -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ 'success.thankYou' | translate }}
        </h2>
        
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ 'success.description' | translate }}
        </p>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div class="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-blue-800 dark:text-blue-300">{{ 'success.secure' | translate }}</span>
          </div>
          
          <div class="flex items-center justify-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 dark:text-green-300">{{ 'success.anonymous' | translate }}</span>
          </div>
          
          <div class="flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <span class="text-purple-800 dark:text-purple-300">{{ 'success.analyzed' | translate }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-4">
        <a 
          routerLink="/surveys"
          class="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {{ 'success.moreSurveys' | translate }}
        </a>
        
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ 'success.or' | translate }}
          <a 
            routerLink="/"
            class="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            {{ 'success.backHome' | translate }}
          </a>
        </div>
      </div>

      <!-- Social Share (Optional) -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {{ 'success.share' | translate }}
        </p>
        
        <div class="flex justify-center space-x-4">
          <button class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"></path>
            </svg>
          </button>
          
          <button class="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
          </button>
          
          <button class="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M.057 9.076c0-4.986 4.05-9.036 9.036-9.036s9.036 4.05 9.036 9.036c0 4.986-4.05 9.036-9.036 9.036S.057 14.062.057 9.076zm14.177-3.235L6.99 12.085 4.764 9.859a.75.75 0 10-1.061 1.061l2.829 2.829a.75.75 0 001.061 0l8.485-8.485a.75.75 0 10-1.061-1.061z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SurveySuccessComponent {}

