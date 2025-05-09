import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'tax',
  pure: false
})
export class TaxPipe implements PipeTransform, OnDestroy {

  isUnitPrice: boolean = true;
  subscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.subscription = this.sharedService.isUnitPrice$.subscribe(
      (isUnitPrice) => {
        this.isUnitPrice = isUnitPrice;
      }
    );
  }

  transform(value: any, showTaxed: boolean = false): any {    
    // 如果是字串，消毒
    let numberValue: number = NaN;

    let type: string = typeof value;
    
    if (type === 'string')
      numberValue = Number([',','$','(未)','(含)'].reduce((value, str) => value.replace(str, ''), value).trim());
    else if (type === 'number')
      numberValue = value;

    // 如果不是數字才回去
    if (isNaN(numberValue)) {
        return value;
    }

    if (!this.isUnitPrice) {
      numberValue *= 1.05;
    }

    let result: string = '$' + numberValue.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0, minimumFractionDigits: 0 });

    if (showTaxed)
      result += this.isUnitPrice ? ' (未)' : ' (含)';

    return result;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}