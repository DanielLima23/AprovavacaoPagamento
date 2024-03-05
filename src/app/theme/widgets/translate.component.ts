import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@core';

@Component({
  selector: 'app-translate',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>translate</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item *ngFor="let lang of langs | keyvalue" (click)="useLanguage(lang.key)">
        <span>{{ lang.value }}</span>
      </button>
    </mat-menu>
  `,
})
export class TranslateComponent {
  langs = {
    'pt-BR': 'Português (Brasil)',
    'en-US': 'English',
    'es-MX': 'Espanhol'
  };

  constructor(private translate: TranslateService, private settings: SettingsService) {
    translate.addLangs(['pt-BR', 'en-US', 'es-MX']);
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.settings.setLanguage(language);
  }
}
