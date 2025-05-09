import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MemberManagementRoutingModule } from './member-management-routing.module';
import { MemberManagementComponent } from './member-management.component';
import { MemberCenterComponent } from './member-center/member-center.component';

import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountManageComponent } from './account-manage/account-manage.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { CompanyInfoRowComponent } from './components/company-info-row/company-info-row.component';
import { CompanyNoticRowComponent } from './components/company-notic-row/company-notic-row.component';
import { CompanyOutsandingRowComponent } from './components/company-outsanding-row/company-outsanding-row.component';
import { CompanyBankRowComponent } from './components/company-bank-row/company-bank-row.component';
import { AccountManageAddaccountRowComponent } from './components/account-manage-addaccount-row/account-manage-addaccount-row.component';
import { DialogService } from 'src/app/shared/services';
import { BonusComponent } from './bonus/bonus.component';
import { AddressManageComponent } from './address-manage/address-manage.component';
import { PrizeComponent } from './prize/prize.component';
import { CommonAddressComponent } from './common-address/common-address.component';
import { DeliveryRemarkComponent } from './delivery-remark/delivery-remark.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { BillComponent } from './bill/bill.component';
import { StockNoticeComponent } from './stock-notice/stock-notice.component';
import { BillNoComponent } from './bill-no/bill-no.component';
import { OrderComponent } from './order/order.component';
import { OrderNumberComponent } from './order-number/order-number.component';
import { PasswordComponent } from './password/password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MemberMenuComponent } from 'src/app/layouts/components/member-menu/member-menu.component';

const Components = [
  MemberManagementComponent,
  MemberCenterComponent,
  AccountManageComponent,
  CompanyInfoComponent,
  CompanyInfoRowComponent,
  CompanyNoticRowComponent,
  CompanyOutsandingRowComponent,
  CompanyBankRowComponent,
  AccountManageAddaccountRowComponent,
  BonusComponent,
  AddressManageComponent,
  PrizeComponent,
  CommonAddressComponent,
  DeliveryRemarkComponent,
  BillComponent,
  WishListComponent,
  BillNoComponent,
  StockNoticeComponent,
  OrderComponent,
  OrderNumberComponent,
  PasswordComponent
];
@NgModule({
  declarations: [...Components],
  imports: [
    CommonModule,
    MemberManagementRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatProgressBarModule,
  ],
  providers: [DialogService]
})
export class MemberManagementModule {}
