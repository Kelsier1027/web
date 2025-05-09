import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutEnum } from 'src/app/enums/layout.enum';
import { DeactivateGuard } from 'src/app/guards';
import { AccountManageComponent } from './account-manage/account-manage.component';
import { AddressManageComponent } from './address-manage/address-manage.component';
import { BillNoComponent } from './bill-no/bill-no.component';
import { BillComponent } from './bill/bill.component';
import { BonusComponent } from './bonus/bonus.component';
import { CommonAddressComponent } from './common-address/common-address.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { DeliveryRemarkComponent } from './delivery-remark/delivery-remark.component';
import { MemberCenterComponent } from './member-center/member-center.component';
import { MemberManagementComponent } from './member-management.component';
import { OrderNumberComponent } from './order-number/order-number.component';
import { OrderComponent } from './order/order.component';
import { PasswordComponent } from './password/password.component';
import { PrizeComponent } from './prize/prize.component';
import { StockNoticeComponent } from './stock-notice/stock-notice.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { DealerViewGuardGuard } from 'src/app/shared/guards/dealer-view-guard.guard';
import { SalesMemberAccessGuard } from 'src/app/shared/guards/sales-member-access.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Member',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MemberManagementComponent,
    canActivateChild: [DealerViewGuardGuard, SalesMemberAccessGuard],
    children: [
      {
        path: 'Member',
        component: MemberCenterComponent,
        data: { name: '會員中心', navCategory: LayoutEnum.Member },
      },
      /** 公司資料管理 */
      {
        path: 'Account',
        component: CompanyInfoComponent,
        data: { name: '公司帳戶', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Manage',
        component: AccountManageComponent,
        data: { name: '帳號管理', navCategory: LayoutEnum.Member },
      },
      {
        path: 'AddressManage',
        component: AddressManageComponent,
        data: { name: '配送地址管理', navCategory: LayoutEnum.Member },
        canDeactivate: [DeactivateGuard],
      },
      {
        path: 'Password',
        component: PasswordComponent,
        data: { name: '變更密碼', navCategory: LayoutEnum.Member },
      },
      /** 我的精技 */
      {
        path: 'Bonus',
        component: BonusComponent,
        data: { name: '紅利好康區', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Prize',
        component: PrizeComponent,
        data: { name: '獎勵活動達成禮', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Wishlist',
        component: WishListComponent,
        data: { name: '我的追蹤', navCategory: LayoutEnum.MyTrace },
      },
      {
        path: 'StockNotice',
        component: StockNoticeComponent,
        data: { name: '貨到通知', navCategory: LayoutEnum.Member },
      },
      /** 訂單與物流 */
      {
        path: 'Order',
        component: OrderComponent,
        data: { name: '訂單查詢', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Order/:id',
        component: OrderNumberComponent,
        data: { name: '訂單明細', navCategory: LayoutEnum.Member },
      },
      {
        path: 'GroupOrder/:id',
        component: OrderNumberComponent,
        data: { name: '訂單明細', navCategory: LayoutEnum.Member },
      },
      {
        path: 'PreOrder/:id',
        component: OrderNumberComponent,
        data: { name: '訂單明細', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Bill',
        component: BillComponent,
        data: { name: '帳單查詢', navCategory: LayoutEnum.Member },
      },
      {
        path: 'Bill/:id',
        component: BillNoComponent,
        data: { name: '帳單明細', navCategory: LayoutEnum.Member },
      },
      /** 結帳偏好設定 */
      {
        path: 'CommonAddress',
        component: CommonAddressComponent,
        data: { name: '常用指送地址', navCategory: LayoutEnum.Member },
      },
      {
        path: 'DeliveryRemark',
        component: DeliveryRemarkComponent,
        data: { name: '常用出貨備註', navCategory: LayoutEnum.Member },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberManagementRoutingModule {}
