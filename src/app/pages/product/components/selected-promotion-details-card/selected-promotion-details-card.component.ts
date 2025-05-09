import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ProductDetail } from 'src/app/models';
import { StickyService } from 'src/app/shared/services/sticky.service';

@Component({
  selector: 'app-selected-promotion-details-card',
  templateUrl: './selected-promotion-details-card.component.html',
  styleUrls: ['./selected-promotion-details-card.component.scss'],
})
export class SelectedPromotionDetailsCardComponent implements OnInit, AfterViewInit {
  @ViewChild('selectedPromotion') selectedPromotion!: ElementRef
  @Input() title?: string;
  @Input() action: boolean = false
  @Input() buttonQtyType: boolean = false
  @Input() detail!: ProductDetail
  @Input() isWish: boolean = false
  @Input() comparsionText?: string;
  @Input() buttonStatus?:
    | 'addToCart'
    | 'preOrder'
    | 'notifyMeOnDelivery'
    | 'contactSales'
    | 'groupBuy';

  @Input()
  buttonDisabled!: boolean;
  @Input()
  canOrder: boolean = true;
  @Output()
  submit = new EventEmitter()
  @Output()
  arrivalNoticeDialog = new EventEmitter()
  @Output()
  clickOnCompare = new EventEmitter()
  @Output()
  clickAddToWishList = new EventEmitter()
  @Output()
  preorderAddToCart = new EventEmitter()

  constructor(public stickyService: StickyService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.stickyService.setItemSticky(this.selectedPromotion.nativeElement)
  }
}
