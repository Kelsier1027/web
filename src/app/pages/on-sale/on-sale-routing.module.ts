import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnSaleComponent } from './on-sale.component';

const routes: Routes = [
  {
    path: 'OnSale',
    component: OnSaleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnSaleRoutingModule { }
