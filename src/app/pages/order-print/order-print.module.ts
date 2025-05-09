import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/shared/services';

import { OrderPrintRoutingModule } from './order-print-routing.module';
import { OrderPrintComponent } from './order-print.component';

@NgModule({
  imports: [CommonModule, MatTableModule, OrderPrintRoutingModule],
  declarations: [OrderPrintComponent],
  providers: [DialogService],
})
export class OrderPrintModule {}
