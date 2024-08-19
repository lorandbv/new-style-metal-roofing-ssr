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
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'cleanzoh-testing',
        appId: '1:862062689993:web:03dd5b072f734339389718',
        databaseURL: 'https://cleanzoh-testing-default-rtdb.firebaseio.com',
        storageBucket: 'cleanzoh-testing.appspot.com',
        apiKey: 'AIzaSyA9QE57J5n7FMl8JHk0IpFBbWWlwUz4y64',
        authDomain: 'cleanzoh-testing.firebaseapp.com',
        messagingSenderId: '862062689993',
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
