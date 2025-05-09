import { Injectable } from '@angular/core';
import { AnalyticsEvent } from '../models/analytics-event.model';
import { BehaviorSubject, Subject, Timestamp, tap, timer } from 'rxjs';
import { EnvConfig } from '../app.module';
import { env } from 'process';

declare var gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  envConfig: EnvConfig;
  constructor(envConfig: EnvConfig) {
    this.envConfig = envConfig;

    // providedIn root, 所以這是一個 singleton, 可以在這裡做 DOM 編輯
    this.init();
  }

  private nextPushableTime: number = new Date().getTime();

  public event(eventName: string, params: any, withMemberInfo = true) {
    if (!this.envConfig.googleAnalyticsKey) return;

    this.enqueueEvent(
      {
        eventName,
        params,
        withMemberInfo
      } as AnalyticsEvent
    )
  }

  private enqueueEvent(event: AnalyticsEvent){
      // GA 限制每秒最多兩個事件，所以這邊嘗試 buffering
      const currentNextPushableTime = this.nextPushableTime;
      const currentTime = new Date().getTime();
      this.nextPushableTime = Math.max(currentTime, this.nextPushableTime + 500);
  
      const timeUntilPush = Math.max(0, currentNextPushableTime - currentTime);

      timer(timeUntilPush)
        .pipe(
          tap(_ => this.handleEvent(event))
        )
        .subscribe();
  }

  private handleEvent(event: AnalyticsEvent){
    gtag('event', event.eventName, {
      ...event.params,
      ...(event.withMemberInfo ? this.getMemberInfo() : {}),
    });
  }

  private init() {
    if (!this.envConfig.googleAnalyticsKey) return;

    try {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.envConfig.googleAnalyticsKey;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML =
        `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '` + this.envConfig.googleAnalyticsKey + `');
      `;
      document.head.appendChild(script2);
    } catch (ex) {
    }
  }

  private getMemberInfo() {
    return {
      cust_company_no: localStorage.getItem('companyNo'),
      cust_company_name: localStorage.getItem('companyName'),
      cust_user_name: localStorage.getItem('customerName'),
      cust_org_id: localStorage.getItem('orgId'),

      cust_user_id: localStorage.getItem('userId'),
      cust_city: localStorage.getItem('city'),
      cust_subinventory: localStorage.getItem('subinventory'),
      time: new Date().toISOString(),
    }
  }
}
