import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { MemberService } from 'src/app/services';
import { Order, OrderDetail } from 'src/app/models';
import { ResponseCode } from 'src/app/enums';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: ['./order-print.component.scss'],
})
export class OrderPrintComponent {
  private dialogService = inject(DialogService);
  columns = [
    'brand',
    'description',
    'inventoryItem',
    'orderedQuantity',
    'unitIorderPrice',
    'price',
  ];

  purchaseId!: number;
  apiResponse!: Observable<OrderDetail>;
  order!: Order;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.apiResponse = this.route.paramMap.pipe(
      map((url) => url.get('purchaseId')),
      switchMap((purchaseNumber) =>
        this.memberService.getOrder({ keyword: purchaseNumber! })
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((order) => {
        this.order = order.order.orderList[0];
      }),
      switchMap((order) =>
        this.memberService.getOrderDetail(this.order.purchaseId)
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result)
    );
  }

  onOpenSummary(): void {
    this.apiResponse.subscribe((res) => {
      const config = {
        width: '300px',
        height: '100px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
        data: {
          noChargeThreshold: res.noChargeThreshold,
          originalFreightCharge: res.originalFreightCharge,
        },
      };

      this.dialogService.openLazyDialog('order-print-summary', config);
    });
  }

  print() {
    window.print();
  }
}
