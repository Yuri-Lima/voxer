import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ 'admin.surveys.detail.title' | translate }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ 'admin.surveys.detail.comingSoon' | translate }}
      </p>
    </div>
  `
})
export class SurveyDetailComponent {}

@Component({
  selector: 'app-survey-edit',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ 'admin.surveys.edit.title' | translate }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ 'admin.surveys.edit.comingSoon' | translate }}
      </p>
    </div>
  `
})
export class SurveyEditComponent {}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ 'admin.users.title' | translate }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ 'admin.users.comingSoon' | translate }}
      </p>
    </div>
  `
})
export class UserListComponent {}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ 'admin.settings.title' | translate }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ 'admin.settings.comingSoon' | translate }}
      </p>
    </div>
  `
})
export class SettingsComponent {}

