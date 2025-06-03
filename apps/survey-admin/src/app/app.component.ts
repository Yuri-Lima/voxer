import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0" 
           [class.translate-x-0]="sidebarOpen" 
           [class.-translate-x-full]="!sidebarOpen">
        
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 bg-blue-600 dark:bg-blue-700">
          <h1 class="text-xl font-bold text-white">
            {{ 'admin.title' | translate }}
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="mt-8">
          <div class="px-4 space-y-2">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              {{ 'admin.nav.dashboard' | translate }}
            </a>

            <a 
              routerLink="/surveys" 
              routerLinkActive="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
              </svg>
              {{ 'admin.nav.surveys' | translate }}
            </a>

            <a 
              routerLink="/responses" 
              routerLinkActive="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              {{ 'admin.nav.responses' | translate }}
            </a>

            <a 
              routerLink="/users" 
              routerLinkActive="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
              {{ 'admin.nav.users' | translate }}
            </a>

            <a 
              routerLink="/settings" 
              routerLinkActive="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
              </svg>
              {{ 'admin.nav.settings' | translate }}
            </a>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:pl-64">
        <!-- Top Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between px-6 py-4">
            <!-- Mobile menu button -->
            <button 
              (click)="toggleSidebar()"
              class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>

            <!-- Right side -->
            <div class="flex items-center space-x-4">
              <!-- Language Selector -->
              <select 
                (change)="changeLanguage($event)"
                class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="pt-br">Português</option>
                <option value="es">Español</option>
              </select>

              <!-- Dark Mode Toggle -->
              <button 
                (click)="toggleDarkMode()"
                class="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              </button>

              <!-- User Menu -->
              <div class="relative">
                <button class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium">A</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile sidebar overlay -->
      <div 
        *ngIf="sidebarOpen" 
        (click)="closeSidebar()"
        class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'survey-admin';
  sidebarOpen = false;

  constructor(private translate: TranslateService) {
    // Configurar idiomas suportados
    this.translate.addLangs(['en', 'pt-br', 'es']);
    this.translate.setDefaultLang('en');

    // Detectar idioma do navegador
    const browserLang = this.translate.getBrowserLang();
    const supportedLang = browserLang && ['en', 'pt-br', 'es'].includes(browserLang) 
      ? browserLang 
      : 'en';
    
    this.translate.use(supportedLang);
  }

  ngOnInit() {
    // Verificar se há preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.translate.use(target.value);
    localStorage.setItem('language', target.value);
  }

  toggleDarkMode() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}

