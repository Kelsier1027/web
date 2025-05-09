import { Component, Input, OnInit } from '@angular/core';
import { PromoInfo } from 'src/app/models';

@Component({
  selector: 'app-discount-card',
  templateUrl: './discount-card.component.html',
  styleUrls: ['./discount-card.component.scss'],
})
export class DiscountCardComponent implements OnInit {
  @Input()
  defaultStyle = true;
  @Input()
  detail!: PromoInfo
  constructor() {}

  ngOnInit(): void {
  }
}
