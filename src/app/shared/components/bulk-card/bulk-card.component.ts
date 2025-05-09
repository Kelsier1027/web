import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-card',
  templateUrl: './bulk-card.component.html',
  styleUrls: ['./bulk-card.component.scss'],
})
export class BulkCardComponent implements OnInit {
  @Input()
  detail!: {
    name: string,
    remark: string,
    startDate: string,
    endDate: string,
    data: {
      level: number;
      minQuantity: number;
      maxQuantity: number;
      promoPrice: number;
    }[],
  }
  constructor() {}

  ngOnInit(): void {}
}
