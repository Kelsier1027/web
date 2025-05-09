import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { CheckoutProcessModule } from './checkout-process/checkout-process.module';
import { OrderCompleteModule } from './order-complete/order-complete.module';
import { OrderIncompleteModule } from './order-incomplete/order-incomplete.module';
import { PromotionModule } from './promotion/promotion.module';
import { OnSaleModule } from './on-sale/on-sale.module';
import { RewardActivityModule } from './reward-activity/reward-activity.module';
import { OptionalPurchaseModule } from './optional-purchase/optional-purchase.module';
import { ProductComparisonModule } from './product-comparison/product-comparison.module';
import { GroupByProcessModule } from './group-by-process/group-by-process.module';
import { PreorderProcessModule } from './preorder-process/preorder-process.module';
import { DealerViewGuardGuard } from '../shared/guards/dealer-view-guard.guard';
import { MatDialogModule } from '@angular/material/dialog';
import { SalesMemberAccessGuard } from '../shared/guards/sales-member-access.guard';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        canActivate: [DealerViewGuardGuard]
      },
      {
        path: 'Member',
        loadChildren: () =>
          import('./member-management/member-management.module').then(
            (m) => m.MemberManagementModule
          ),
        canActivate: [DealerViewGuardGuard, SalesMemberAccessGuard]
      },
      {
        path: 'CustomerService',
        loadChildren: () =>
          import('./customer-service/customer-service.module').then(
            (m) => m.CustomerServiceModule
          ),
        canActivate: [DealerViewGuardGuard]
      },
      {
        path: 'ProductList',
        loadChildren: () =>
          import('./product-list/product-list.module').then(
            (m) => m.ProductListModule
          ),
        canActivate: [DealerViewGuardGuard]
      },
      {
        path: 'Product',
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
       canActivate: [DealerViewGuardGuard]
      },
      {
        path: 'Order',
        loadChildren: () =>
          import('./order-print/order-print.module').then(
            (m) => m.OrderPrintModule
          ),
        canActivate: [DealerViewGuardGuard]
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    MatDialogModule,
    ProductComparisonModule,
    RewardActivityModule,
    PromotionModule,
    OnSaleModule,
    ShoppingCartModule,
    OptionalPurchaseModule,
    CheckoutProcessModule,
    GroupByProcessModule,
    OrderCompleteModule,
    OrderIncompleteModule,
    PreorderProcessModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
