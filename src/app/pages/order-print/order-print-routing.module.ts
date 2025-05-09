import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderPrintComponent } from './order-print.component';

const routes: Routes = [{ path: 'PrintOrder/:purchaseId', component: OrderPrintComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPrintRoutingModule {}
