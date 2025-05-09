import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart.component';
import { DealerViewGuardGuard } from 'src/app/shared/guards/dealer-view-guard.guard';
import { SalesMemberAccessGuard } from 'src/app/shared/guards/sales-member-access.guard';

const routes: Routes = [
  {
    path: 'ShoppingCart',
    component: ShoppingCartComponent,
    canActivate: [DealerViewGuardGuard, SalesMemberAccessGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartRoutingModule {}
