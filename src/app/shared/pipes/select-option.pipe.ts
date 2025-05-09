import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'ramda';

@Pipe({
  name: 'selectOption'
})
export class SelectOptionPipe implements PipeTransform {

  transform(array: any[], key: string): any[] {
    return !array ? [] : map((value) => ({ label: value[key], value }), array);
  }
}
