import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fixedNavDate' })
export class FixedNavDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string): unknown {
    const today = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    return value === today ? '今日' : value;
  }
}
