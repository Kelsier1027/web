/** --------------------------------------------------------------------------------
 *-- Description： 訂單追蹤
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Order, OrderDetail } from 'src/app/models';
import { LayoutService } from '../../services';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
})
export class OrderTrackingComponent implements OnInit {
  @Input() data!: Order | OrderDetail;
  @Input() isCancel: boolean = false;

  tracking!: {
    stage: number;
    creationDate: string;
    transferedDatetime: string;
    pickDate: string;
    estimateDeliverTime: string;
    lastUpdatedDate: string;
  };
  iconMap = [
    [
      'active',
      'current_order',
      'not_reached',
      'not_reached_search',
      'not_reached',
      'not_reached_tally',
      'not_reached',
      'not_reached_delivery',
      'not_reached',
      'not_reached_address',
    ],
    [
      'current',
      'order_achieve',
      'active',
      'current_search',
      'not_reached',
      'not_reached_tally',
      'not_reached',
      'not_reached_delivery',
      'not_reached',
      'not_reached_address',
    ],
    [
      'current',
      'order_achieve',
      'current',
      'order_search',
      'active',
      'current_tally',
      'not_reached',
      'not_reached_delivery',
      'not_reached',
      'not_reached_address',
    ],
    [
      'current',
      'order_achieve',
      'current',
      'order_search',
      'current',
      'order_tally',
      'active',
      'current_delivery',
      'not_reached',
      'not_reached_address',
    ],
    [
      'current',
      'order_achieve',
      'current',
      'order_search',
      'current',
      'order_tally',
      'current',
      'order_delivery',
      'active_address',
      'order_address',
    ],
    [
      "current",
      "order_achieve",
      "current",
      "order_cancel"
    ]
  ];
  isMobile!: boolean;

  constructor(
    private datepipe: DatePipe,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    const temp: typeof this.tracking = {
      creationDate: this.data.creationDate,
      ...this.data.tracking,
      stage: 0,
    };

    this.tracking = {
      ...temp,
      stage: temp.lastUpdatedDate
        ? 4
        : temp.estimateDeliverTime
        ? 3
        : temp.pickDate
        ? 2
        : temp.transferedDatetime
        ? 1
        : 0,
    };

    if (this.isCancel) {
      this.tracking.stage = 5;
    }
    this.layoutService.layoutChanges$.subscribe(
      (size) => (this.isMobile = size === 'small')
    );
  }
}
