// import { NgModule } from '@angular/core';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppComponent } from './app.component';

// import { CoreModule } from '@core/core.module';
// import { ThemeModule } from '@theme/theme.module';
// import { SharedModule } from '@shared/shared.module';
// import { RoutesModule } from './routes/routes.module';
// import { FormlyConfigModule } from './formly-config.module';
// import { NgxPermissionsModule } from 'ngx-permissions';
// import { ToastrModule } from 'ngx-toastr';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// import { environment } from '@env/environment';
// import { BASE_URL, httpInterceptorProviders, appInitializerProviders } from '@core';

// // Required for AOT compilation
// export function TranslateHttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// import { LoginService } from '@core/authentication/login.service';
// import { FakeLoginService } from './fake-login.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CurrencyPipe } from '@angular/common';
// import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     BrowserModule,
//     HttpClientModule,
//     CoreModule,
//     ThemeModule,
//     RoutesModule,
//     SharedModule,
//     FormlyConfigModule.forRoot(),
//     NgxPermissionsModule.forRoot(),
//     ToastrModule.forRoot(),
//     TranslateModule.forRoot({
//       loader: {
//         provide: TranslateLoader,
//         useFactory: TranslateHttpLoaderFactory,
//         deps: [HttpClient],
//       },
//     }),
//     BrowserAnimationsModule,

//   ],
//   providers: [
//     { provide: BASE_URL, useValue: environment.baseUrl },
//     { provide: LoginService, useClass: FakeLoginService },
//     { provide: MAT_DIALOG_DEFAULT_OPTIONS, useFactory: dialogConfigFactory },
//     httpInterceptorProviders,
//     appInitializerProviders,
//     CurrencyPipe
//   ],
//   bootstrap: [AppComponent],
// })

// export class AppModule {}


// export function dialogConfigFactory(): any {
//   const width = window.innerWidth <= 600 ? '90%' : '20%';
//   return { width };
// }


import { NgModule, InjectionToken } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { FormlyConfigModule } from './formly-config.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@env/environment';
import { BASE_URL, httpInterceptorProviders, appInitializerProviders } from '@core';

import { LoginService } from '@core/authentication/login.service';
import { FakeLoginService } from './fake-login.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

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
