import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutProcessComponent } from './checkout-process.component';

const routes: Routes = [
  {
    path: 'CheckoutProcess',
    component: CheckoutProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutProcessRoutingModule {}
