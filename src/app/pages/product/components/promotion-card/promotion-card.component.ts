import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-promotion-card',
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.scss']
})
export class PromotionCardComponent implements OnInit {
  @Input()
  price?: number;
  @Input()
  priceCurrency?: string;
  @Input()
  discount!: number;
  @Input()
  bulk?: boolean;
  @Input()
  isWelfare?: boolean

  isUnitPrice: boolean = true;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.isUnitPrice$.subscribe((isUnitPrice) => {
      this.isUnitPrice = isUnitPrice;
    });
  }
}
