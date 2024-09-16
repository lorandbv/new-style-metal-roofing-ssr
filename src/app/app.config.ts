import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'newstylemetalroofing-staging',
        appId: '1:1008021755471:web:13c099d9fb59721cdafc3a',
        storageBucket: 'newstylemetalroofing-staging.appspot.com',
        apiKey: 'AIzaSyBQYdFYCT_ahGbKA7sYdLDNPRVnVwzrck0',
        authDomain: 'newstylemetalroofing-staging.firebaseapp.com',
        messagingSenderId: '1008021755471',
        measurementId: 'G-XRY15EFMLB',
      })
    ),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ScreenTrackingService,
    UserTrackingService,
    provideAnimations(),
    provideToastr({
      maxOpened: 5,
      autoDismiss: true,
      preventDuplicates: false,
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }),
  ],
};
