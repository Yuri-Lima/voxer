import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ 'app.title' | translate }}
              </h1>
            </div>

            <!-- Language Selector -->
            <div class="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            {{ 'app.footer' | translate }}
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'survey-app';

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

