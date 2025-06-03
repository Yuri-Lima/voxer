import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ 'admin.dashboard.title' | translate }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          {{ 'admin.dashboard.subtitle' | translate }}
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
        <p>{{ 'admin.dashboard.error' | translate }}: {{ error }}</p>
      </div>

      <!-- Statistics Cards -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Surveys -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ 'admin.dashboard.totalSurveys' | translate }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stats?.totalSurveys || 0 }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Responses -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ 'admin.dashboard.totalResponses' | translate }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stats?.totalResponses || 0 }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Respondents -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ 'admin.dashboard.totalRespondents' | translate }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stats?.totalRespondents || 0 }}
              </p>
            </div>
          </div>
        </div>

        <!-- Active Surveys -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ 'admin.dashboard.activeSurveys' | translate }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stats?.activeSurveys || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Response Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ 'admin.dashboard.responsesChart' | translate }}
          </h3>
          
          <!-- Simple Bar Chart -->
          <div class="space-y-3">
            <div *ngFor="let item of responsesByDay" class="flex items-center">
              <div class="w-20 text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(item.date) }}
              </div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    class="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    [style.width.%]="getBarWidth(item.count)"
                  ></div>
                </div>
              </div>
              <div class="w-12 text-sm text-gray-900 dark:text-white text-right">
                {{ item.count }}
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Responses -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ 'admin.dashboard.recentResponses' | translate }}
          </h3>
          
          <div class="space-y-3">
            <div *ngFor="let response of recentResponses" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ 'admin.dashboard.response' | translate }} #{{ response.id.substring(0, 8) }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(response.createdAt) }}
                </p>
              </div>
              <a 
                [routerLink]="['/responses', response.id]"
                class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {{ 'admin.dashboard.view' | translate }}
              </a>
            </div>
            
            <div *ngIf="recentResponses.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              {{ 'admin.dashboard.noRecentResponses' | translate }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div *ngIf="!loading && !error" class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ 'admin.dashboard.quickActions' | translate }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            routerLink="/surveys/create"
            class="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
            {{ 'admin.dashboard.createSurvey' | translate }}
          </a>
          
          <a 
            routerLink="/surveys"
            class="flex items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
            </svg>
            {{ 'admin.dashboard.manageSurveys' | translate }}
          </a>
          
          <a 
            routerLink="/responses"
            class="flex items-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            {{ 'admin.dashboard.viewResponses' | translate }}
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  responsesByDay: any[] = [];
  recentResponses: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.responsesByDay = data.responsesByDay || [];
        this.recentResponses = data.recentResponses || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = error.message || 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  getBarWidth(count: number): number {
    if (!this.responsesByDay.length) return 0;
    const maxCount = Math.max(...this.responsesByDay.map(item => item.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

