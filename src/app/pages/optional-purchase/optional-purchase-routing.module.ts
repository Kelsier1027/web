import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionalPurchaseComponent } from './optional-purchase.component';


const routes: Routes = [
  {
    path: 'OptionalPurchase',
    component: OptionalPurchaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionalPurchaseRoutingModule { }
