import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'promotionName'
})
export class PromotionNamePipe implements PipeTransform {

  transform(promoInfos: any[], promoId: number): unknown {
    const result = promoInfos.find(info => info.id === promoId)
    return result ? result.name : '';
  }
}
