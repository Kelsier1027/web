import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { LocalStorage } from '../model/Istorage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage;
  private valueChangedSubject: BehaviorSubject<any>;
  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<any>) {
    this.storage = new LocalStorage();
    if (isPlatformBrowser(platformId)) {
      this.storage = localStorage;
    }
    this.valueChangedSubject = new BehaviorSubject<any>(null);
  }
  get(key: string, type = 'localStorage'): Record<string, unknown> {
    return type === 'localStorage'
      ? JSON.parse(this.storage.getItem(key) as string)
      : JSON.parse(sessionStorage.getItem(key) as string);
  }

  set(key: string, obj: any, type = 'localStorage'): void {
    type === 'localStorage'
      ? this.storage.setItem(key, JSON.stringify(obj))
      : sessionStorage.setItem(key, JSON.stringify(obj));
      this.valueChangedSubject.next(true);
  }

  clear(type = 'localStorage'): void {
    const storage = type === 'localStorage' ? this.storage : sessionStorage;

    Object.keys(localStorage).forEach((key) => {
      const isAdminKeyName =
        key?.includes('admin') || key?.includes('rememberme');
      const isUserPopupDate = key.includes('userPopupDate');
      if(!isAdminKeyName && !isUserPopupDate){
        storage.removeItem(key as string);
      } 
    });
    this.valueChangedSubject.next(true);
  }

  removeItem(key: string, type = 'localStorage'): void {
    type === 'localStorage'
      ? this.storage.removeItem(key)
      : sessionStorage.removeItem(key);
    this.valueChangedSubject.next(true);
  }

  hasItem(key: string, type = 'localStorage'): boolean {
    if (type === 'localStorage') {
      return this.storage.getItem(key) ? true : false;
    } else {
      return sessionStorage.getItem(key) ? true : false;
    }
  }
  valueChanged(): Observable<any> {
    return this.valueChangedSubject.asObservable();
  }
}
