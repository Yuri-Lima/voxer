import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="text-center">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          {{ 'home.hero.title' | translate }}
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90">
          {{ 'home.hero.subtitle' | translate }}
        </p>
        <a 
          routerLink="/surveys"
          class="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {{ 'home.hero.cta' | translate }}
        </a>
      </div>

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {{ 'home.features.easy.title' | translate }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'home.features.easy.description' | translate }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {{ 'home.features.anonymous.title' | translate }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'home.features.anonymous.description' | translate }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {{ 'home.features.mobile.title' | translate }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ 'home.features.mobile.description' | translate }}
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
        <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ 'home.cta.title' | translate }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {{ 'home.cta.description' | translate }}
        </p>
        <a 
          routerLink="/surveys"
          class="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {{ 'home.cta.button' | translate }}
        </a>
      </div>
    </div>
  `
})
export class HomeComponent {}

