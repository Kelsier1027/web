import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input()
  countDownTime: number = 0;

  interval: any;

  constructor() { }

  ngOnInit(): void {
    this.startCountdown();
  }

  // Modify by Tako on 2025/03/12 for No.20250057
  formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedDays = days < 10 ? `0${days}` : days;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `<span class="timeUnit">${formattedDays}</span> 天 &nbsp;&nbsp;
       <span class="timeUnit">${formattedHours}</span>
     : <span class="timeUnit">${formattedMinutes}</span>
     : <span class="timeUnit">${formattedSeconds}</span>`;
  }


  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countDownTime > 0) {
        this.countDownTime--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

}
