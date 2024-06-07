import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InjectionToken, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { CoreModule } from '@core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '@shared/shared.module';
import { ThemeModule } from '@theme/theme.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { FormlyConfigModule } from './formly-config.module';
import { RoutesModule } from './routes/routes.module';

import { appInitializerProviders, BASE_URL, httpInterceptorProviders } from '@core';
import { environment } from '@env/environment';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from '@core/authentication/login.service';
import { FakeLoginService } from './fake-login.service';

registerLocaleData(ptBr);

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const DIALOG_DEFAULT_OPTIONS = new InjectionToken<any>('DIALOG_DEFAULT_OPTIONS');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    ThemeModule,
    RoutesModule,
    SharedModule,
    FormlyConfigModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,


  ],
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: LoginService, useClass: FakeLoginService },
    { provide: DIALOG_DEFAULT_OPTIONS, useFactory: dialogConfigFactory },
    {provide: LOCALE_ID, useValue: 'pt' },
    httpInterceptorProviders,
    appInitializerProviders,
    CurrencyPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function dialogConfigFactory(): any {
  const width = window.innerWidth <= 600 ? '90%' : '20%';
  return { width };
}
