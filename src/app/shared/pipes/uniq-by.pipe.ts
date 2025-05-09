import { Pipe, PipeTransform } from '@angular/core';
import { prop, uniqBy } from 'ramda';

@Pipe({
  name: 'uniqBy'
})
export class UniqByPipe implements PipeTransform {

  transform(array: any[], key: string): any[] {
    return uniqBy(prop(key))(array);
  }
}
