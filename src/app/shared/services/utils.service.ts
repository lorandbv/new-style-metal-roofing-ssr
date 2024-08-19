import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  isAdmin: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);

  constructor() {}
}
