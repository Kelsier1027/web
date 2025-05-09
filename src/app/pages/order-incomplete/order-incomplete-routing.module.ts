import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderIncompleteComponent } from './order-incomplete.component';

const routes: Routes = [
  {
    path: 'OrderIncomplete',
    component: OrderIncompleteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderIncompleteRoutingModule {}
