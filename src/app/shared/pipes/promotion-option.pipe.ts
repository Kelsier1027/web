import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'ramda';
import { SelectOptionPipe } from './select-option.pipe';

@Pipe({
  name: 'promotionOption',
})
export class PromotionOptionPipe
  extends SelectOptionPipe
  implements PipeTransform
{
  override transform(array: any[], key: string): any[] {
    array.forEach(item => {
      if (item.id === 0) item.name = '經銷價';
    });
    return super.transform(array, key);
  }
}
