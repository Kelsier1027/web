import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
export interface PeriodicElement {
  activityName: string;
  shipType: string;
  productName: string;
  number: number;
  closeTime: string;
  productType: string;
}

@Component({
  selector: 'app-activity-bonus',
  templateUrl: './activity-bonus.component.html',
  styleUrls: ['./activity-bonus.component.scss'],
})
export class ActivityBonusComponent {
  @Input() awards: PeriodicElement[] = [];
  @Input() awardsChecked: number[] = [];
  @Input() currentScreenSize : string = '';
  @Output() selectFunction = new EventEmitter();
  @Output() selectAllFunction = new EventEmitter();
  @HostBinding('class') class = 'activity-bonus';
  ShowList : boolean = true;
  ShowListColumns : String[] = ['checkbox','activityName','number'];
  checkedFunction(event: MatCheckboxChange, giftListId: number) {
    this.selectFunction.emit({
      checked: event.checked,
      giftListId
    });
  }

  checkedAllFunction(event: MatCheckboxChange) {
    const checked = event.checked;
    this.selectAllFunction.emit(checked);
  }
  // togglelist(){
  //   this.ShowList=!this.ShowList;
  //   if(this.ShowListColumns.length == 0){
  //     this.ShowListColumns = ['checkbox','activityName','number'];
  //   }
  //   else{
  //     this.ShowListColumns = [];
  //   }
  // }
}
