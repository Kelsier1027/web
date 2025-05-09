import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-print-summary',
  templateUrl: './order-print-summary.component.html',
  styleUrls: ['./order-print-summary.component.scss'],
})
export class OrderPrintSummaryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
