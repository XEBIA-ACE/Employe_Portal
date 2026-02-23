import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { APP_ROUTES } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { loggingInterceptor } from '@core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Performance: event coalescing reduces unnecessary change detection cycles
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router with feature flags
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(), // Bind route params to component @Input()
      withViewTransitions()        // Smooth page transitions (Chrome 111+)
    ),

    // HTTP client with functional interceptors (applied in order)
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor, // 1. Log all requests
        authInterceptor,    // 2. Attach Bearer token
        errorInterceptor    // 3. Handle errors globally
      ])
    ),

    // Angular Material
    provideAnimations(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ]
};
