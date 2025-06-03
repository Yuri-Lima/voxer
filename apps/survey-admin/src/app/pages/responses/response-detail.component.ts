import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-response-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ 'admin.responses.detail.title' | translate }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ 'admin.responses.detail.comingSoon' | translate }}
      </p>
    </div>
  `
})
export class ResponseDetailComponent {}

