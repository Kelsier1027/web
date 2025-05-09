import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCompleteComponent } from './order-complete.component';

const routes: Routes = [
  {
    path: 'OrderComplete',
    component: OrderCompleteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCompleteRoutingModule {}
