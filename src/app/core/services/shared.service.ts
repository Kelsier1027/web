// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EnvConfig } from 'src/app/app.module';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private isUnitPriceSubject = new BehaviorSubject<boolean>(true);
  isUnitPrice$ = this.isUnitPriceSubject.asObservable();

  private tracingItemsSubject = new BehaviorSubject<number>(0);
  tracingItems$ = this.tracingItemsSubject.asObservable();

  constructor(private envConfig: EnvConfig, private storage: StorageService) {
    this.init();
  }

  private init(): void {
    let rememberMeData = this.storage.get(this.envConfig.rememberMeKey);

    if (!rememberMeData) rememberMeData = {};
    if (!('isunitprice' in rememberMeData)) {
      rememberMeData['isunitprice'] = true;
      this.storage.set(this.envConfig.rememberMeKey, rememberMeData);
    }
    this.setUnitPrice(rememberMeData['isunitprice'] as boolean);
    if (!('tracingItems' in rememberMeData)) {
      rememberMeData['tracingItems'] = 0;
      this.storage.set(this.envConfig.rememberMeKey, rememberMeData);
    }
    this.updateTracingItems(rememberMeData['tracingItems'] as number);

    
  }

  public setUnitPrice(isUnitPrice: boolean): void {
    const rememberMeData = this.storage.get(this.envConfig.rememberMeKey);

    this.isUnitPriceSubject.next(isUnitPrice);
    rememberMeData['isunitprice'] = isUnitPrice;
    this.storage.set(this.envConfig.rememberMeKey, rememberMeData);
  }

  public updateTracingItems(count: number): void {
    this.tracingItemsSubject.next(count);
  }
}
