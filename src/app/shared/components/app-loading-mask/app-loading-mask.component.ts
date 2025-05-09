import { Component, Input, OnInit } from '@angular/core';
import { Subscription, tap, timer } from 'rxjs';

@Component({
  selector: 'app-loading-mask',
  templateUrl: './app-loading-mask.component.html',
  styleUrls: ['./app-loading-mask.component.scss']
})
export class AppLoadingMaskComponent implements OnInit {

  _showIf: boolean = false;
  showTooLongMessage: boolean = false;

  @Input()
  get showIf() {
    return this._showIf;
  }

  runningTimer: Subscription | null = null;

  set showIf(value: boolean) {
    if (this.showIf == value)
      return;

    // 打開時就開始計時，計時到就顯示讀取過久的訊息
    if (value)
    {
      this.startTimer();
    }
    else // 中止 timer, 關閉讀取過久訊息
    {
      this.stopTimer();
      this.showTooLongMessage = false;
    }

    this._showIf = value;
  }

  
  constructor(
  ) { }

  ngOnInit(): void {
  }

  startTimer(): void {
    if(this.hasRunningTimer())
      return;

    this.runningTimer = timer(5000)
      .pipe(tap(_ => this.showTooLongMessage = true))
      .subscribe();
  }

  stopTimer(): void {
    if(!this.hasRunningTimer())
      return;

    this.runningTimer?.unsubscribe();
    this.runningTimer = null;
  }

  hasRunningTimer(): boolean {
    return this.runningTimer != null && !this.runningTimer.closed;
  }

}
