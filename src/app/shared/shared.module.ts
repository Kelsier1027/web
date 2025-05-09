import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { SwiperModule } from 'swiper/angular';
import { ShareMaterialModule } from '../share-material/share-material.module';
import { TaxPipe } from '../tax.pipe';
import { SearchBottomSheetComponent } from './components/bottom-sheet/search-bottom-sheet/search-bottom-sheet.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BulkCardComponent } from './components/bulk-card/bulk-card.component';
import { ButtonComponent } from './components/button/button.component';
import { MenuButtonComponent } from './components/button/menu-button/menu-button.component';
import { ChecboxTermsOfUseComponent } from './components/checkboxs/checbox-terms-of-use/checbox-terms-of-use.component';
import { ModelCheckboxComponent } from './components/checkboxs/model-checkbox/model-checkbox.component';
import { DetailItemComponent } from './components/detail-item/detail-item.component';
import { AccountPermissionsComponent } from './components/dialogs/account-permissions/account-permissions.component';
import { AddBillShippingAddressComponent } from './components/dialogs/add-bill-shipping-address/add-bill-shipping-address.component';
import { AdvancedSearchViewComponent } from './components/dialogs/advanced-search-view/advanced-search-view.component';
import { ApplyToChangeComponent } from './components/dialogs/apply-to-change/apply-to-change.component';
import { ArrivalNoticeComponent } from './components/dialogs/arrival-notice/arrival-notice.component';
import { BlackTextDialogComponent } from './components/dialogs/black-text-dialog/black-text-dialog.component';
import { BonusDetailComponent } from './components/dialogs/bonus-detail/bonus-detail.component';
import { BonusDueComponent } from './components/dialogs/bonus-due/bonus-due.component';
import { CommonCancelConfirmComponent } from './components/dialogs/common-cancel-confirm/common-cancel-confirm.component';
import { ContactBusinessComponent } from './components/dialogs/contact-business/contact-business.component';
import { CreateAddressComponent } from './components/dialogs/create-address/create-address.component';
import { CreateDeliveryRemarkComponent } from './components/dialogs/create-delivery-remark/create-delivery-remark.component';
import { DealerViewComponent } from './components/dialogs/dealer-view/dealer-view.component';
import { DeleteAddressComponent } from './components/dialogs/delete-address/delete-address.component';
import { DigitalGoodsComponent } from './components/dialogs/digital-goods/digital-goods.component';
import { DiscardChangesComponent } from './components/dialogs/discard-changes/discard-changes.component';
import { ForgetPasswordComponent } from './components/dialogs/forget-password/forget-password.component';
import { HelpContactComponent } from './components/dialogs/help-contact/help-contact.component';
import { HomePopupComponent } from './components/dialogs/home-popup/home-popup.component';
import { IncorrectPasswordComponent } from './components/dialogs/incorrect-password/incorrect-password.component';
import { InvoiceDeliveryComponent } from './components/dialogs/invoice-delivery/invoice-delivery.component';
import { HeaderFooterFixedcloseLayoutComponent } from './components/dialogs/layout/header-footer-fixedclose-layout/header-footer-fixedclose-layout.component';
import { HeaderInlineCloseLayoutComponent } from './components/dialogs/layout/header-inline-close-layout/header-inline-close-layout.component';
import { HeaderLayoutComponent } from './components/dialogs/layout/header-layout/header-layout.component';
import { MemberAddAccountComponent } from './components/dialogs/member-add-account/member-add-account.component';
import { MemberResetPasswordComponent } from './components/dialogs/member-reset-password/member-reset-password.component';
import { OrderCancelReasonComponent } from './components/dialogs/order-cancel-reason/order-cancel-reason.component';
import { OrderPrintSummaryComponent } from './components/dialogs/order-print-summary/order-print-summary.component';
import { OrderStatusDescriptionComponent } from './components/dialogs/order-status-description/order-status-description.component';
import { PrepayComponent } from './components/dialogs/prepay/prepay.component';
import { ProductAddedToShoppingCartComponent } from './components/dialogs/product-added-to-shopping-cart/product-added-to-shopping-cart.component';
import { ProductCommodityCancelConfirmComponent } from './components/dialogs/product-commodity-cancel-confirm/product-commodity-cancel-confirm.component';
import { ProductCommodityChangeCancelCartComponent } from './components/dialogs/product-commodity-change-cancel-cart/product-commodity-change-cancel-cart.component';
import { ProductCommodityChangeComponent } from './components/dialogs/product-commodity-change/product-commodity-change.component';
import { ProductCommodityDeleteNotifyComponent } from './components/dialogs/product-commodity-delete-notify/product-commodity-delete-notify.component';
import { ProductCommodityPhoneConfirmComponent } from './components/dialogs/product-commodity-phone-confirm/product-commodity-phone-confirm.component';
import { ProductCommodityPlanComponent } from './components/dialogs/product-commodity-plan/product-commodity-plan.component';
import { ProductDeleteFilterComponent } from './components/dialogs/product-delete-filter/product-delete-filter.component';
import { ProductDirectionsComponent } from './components/dialogs/product-directions/product-directions.component';
import { ProductEditFilterComponent } from './components/dialogs/product-edit-filter/product-edit-filter.component';
import { ProductFilterLimitedComponent } from './components/dialogs/product-filter-limited/product-filter-limited.component';
import { ProductFilterModifierComponent } from './components/dialogs/product-filter-modifier/product-filter-modifier.component';
import { ProductListFilterMobileDialogsComponent } from './components/dialogs/product-list-filter-mobile-dialogs/product-list-filter-mobile-dialogs.component';
import { ProductModifyFilterComponent } from './components/dialogs/product-modify-filter/product-modify-filter.component';
import { ProductRemindMeComponent } from './components/dialogs/product-remind-me/product-remind-me.component';
import { ProductSaveFilterComponent } from './components/dialogs/product-save-filter/product-save-filter.component';
import { SelectProductComponent } from './components/dialogs/select-product/select-product.component';
import { SendPasswordComponent } from './components/dialogs/send-password/send-password.component';
import { SerialDetailComponent } from './components/dialogs/serial-detail/serial-detail.component';
import { SerialListComponent } from './components/dialogs/serial-list/serial-list.component';
import { ShippingMethodComponent } from './components/dialogs/shipping-method/shipping-method.component';
import { ShippingNoComponent } from './components/dialogs/shipping-no/shipping-no.component';
import { SimpleDialogComponent } from './components/dialogs/simple-dialog/simple-dialog.component';
import { CancelOrderDialogComponent } from './components/dialogs/cancel-order-dialog/cancel-order-dialog.component';
import { SortMobileDialogComponent } from './components/dialogs/sort-mobile-dialog/sort-mobile-dialog.component';
import { TermsOfServiceComponent } from './components/dialogs/terms-of-service/terms-of-service.component';
import { WelfareProductsComponent } from './components/dialogs/welfare-products/welfare-products.component';
import { DiscountCardComponent } from './components/discount-card/discount-card.component';
import { FilterFormComponent } from './components/filter-form/filter-form.component';
import { GuideColumnLabelComponent } from './components/guide-column-label/guide-column-label.component';
import { IconComponent } from './components/icon/icon.component';
import { ImagesCardComponent } from './components/images-card/images-card.component';
import { CountInputComponent } from './components/inputs/count-input/count-input.component';
import { DateInputComponent } from './components/inputs/date-input/date-input.component';
import { DateRangeFilterComponent } from './components/inputs/date-range-filter/date-range-filter.component';
import { IncrementInputComponent } from './components/inputs/increment-input/increment-input.component';
import { LabelInputComponent } from './components/inputs/label-input/label-input.component';
import { PasswordInputComponent } from './components/inputs/password-input/password-input.component';
import { SearchInputComponent } from './components/inputs/search-input/search-input.component';
import { SearchRadiusInputComponent } from './components/inputs/search-radius-input/search-radius-input.component';
import { TextareaInputComponent } from './components/inputs/textarea-input/textarea-input.component';
import { IconLabelComponent } from './components/labels/icon-label/icon-label.component';
import { TagComponent } from './components/labels/tag/tag.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MobileTableContainerComponent } from './components/mobile-table-container/mobile-table-container.component';
import { MobileTableItemComponent } from './components/mobile-table-item/mobile-table-item.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { PlusMinusInputComponent } from './components/plus-minus-input/plus-minus-input.component';
import { ProductCardBadgeComponent } from './components/product-card/layout/product-card-badge/product-card-badge.component';
import { ProductCardColumnWrapperComponent } from './components/product-card/layout/product-card-column-wrapper/product-card-column-wrapper.component';
import { ProductCardFooterComponent } from './components/product-card/layout/product-card-footer/product-card-footer.component';
import { ProductCardIconComponent } from './components/product-card/layout/product-card-icon/product-card-icon.component';
import { ProductCardOldPriceComponent } from './components/product-card/layout/product-card-old-price/product-card-old-price.component';
import { ProductCardPriceComponent } from './components/product-card/layout/product-card-price/product-card-price.component';
import { ProductCardRowWrapperComponent } from './components/product-card/layout/product-card-row-wrapper/product-card-row-wrapper.component';
import { ProductCardSubTitleComponent } from './components/product-card/layout/product-card-sub-title/product-card-sub-title.component';
import { ProductCardTagComponent } from './components/product-card/layout/product-card-tag/product-card-tag.component';
import { ProductCardTitleComponent } from './components/product-card/layout/product-card-title/product-card-title.component';
import { ProductCardTypeComponent } from './components/product-card/layout/product-card-type/product-card-type.component';
import { ProductCardComponent } from './components/product-card/layout/product-card/product-card.component';
import { ProductCardColumnComponent } from './components/product-card/product-card-column/product-card-column.component';
import { ProductCardRowComponent } from './components/product-card/product-card-row/product-card-row.component';
import { ProductComparisonComponent } from './components/product-comparison/product-comparison.component';
import { ProductControlComponent } from './components/product-control/product-control.component';
import { ProductDetailCardComponent } from './components/product-detail-card/product-detail-card.component';
import { ProductListFilterMobileComponent } from './components/product-list-filter-mobile/product-list-filter-mobile.component';
import { ProductListFilterComponent } from './components/product-list-filter/product-list-filter.component';
import { PromptComponent } from './components/prompt/prompt.component';
import { LabelRadioComponent } from './components/radios/label-radio/label-radio.component';
import { ReCaptchaComponent } from './components/re-captcha/re-captcha.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SelectedDetailCardComponent } from './components/selected-detail-card/selected-detail-card.component';
import { IconSelectComponent } from './components/selects/icon-select/icon-select.component';
import { InfoNotificationComponent } from './components/snackbar/info-notification/info-notification.component';
import { NotificationComponent } from './components/snackbar/notification.component';
import { StatusTypeComponent } from './components/status-card/layout/status-type/status-type.component';
import {
  StatusCardComponent,
  StatusItemDirective,
} from './components/status-card/status-card.component';
import {
  StatusFilterComponent,
  StatusFilterDirective,
} from './components/status-filter/status-filter.component';
import { StatusTagComponent } from './components/status-tag/status-tag.component';
import { TableContainerComponent } from './components/table-container/table-container.component';
import TableComponent, {
  TableDirective,
} from './components/table/table.component';
import { TitleComponent } from './components/title/title.component';
import { TreeListComponent } from './components/tree-list/tree-list.component';
import { DynamicFieldDirective } from './directives/dynamic-field.directive';
import { ScrollAnchorDirective } from './directives/scroll-anchor.directive';
import { ScrollManagerDirective } from './directives/scroll-manager.directive';
import { ScrollSectionDirective } from './directives/scroll-section.directive';
import { BulkLastSettingPricePipe } from './pipes/bulk-last-setting-price.pipe';
import { FixedNavDatePipe } from './pipes/custom-date.pipe';
import { ProductListPromosPipe } from './pipes/product-list-promos.pipe';
import { MaxBuyMessagePipe } from './pipes/product.pipe';
import { PromotionNamePipe } from './pipes/promotion-name.pipe';
import { PromotionOptionPipe } from './pipes/promotion-option.pipe';
import { SearchHighlightPipe } from './pipes/search-highlight.pipe';
import { SelectOptionPipe } from './pipes/select-option.pipe';
import { TotalPricePipe } from './pipes/total-price.pipe';
import { UniqByPipe } from './pipes/uniq-by.pipe';
import { AppLoadingMaskComponent } from './components/app-loading-mask/app-loading-mask.component';
import { AveragePricePipe } from './pipes/average-price.pipe';
import { PromoPricePipe } from './pipes/promo-price.pipe';
import { GeneralComboPricePipe } from './pipes/general-combo-price.pipe';

const Components = [
  DateRangeFilterComponent,
  TagComponent,
  ButtonComponent,
  LabelInputComponent,
  ModelCheckboxComponent,
  ReCaptchaComponent,
  PasswordInputComponent,
  TableDirective,
  DynamicFieldDirective,
  PromptComponent,
  NotificationComponent,
  TreeListComponent,
  IconLabelComponent,
  IconComponent,
  GuideColumnLabelComponent,
  ForgetPasswordComponent,
  TermsOfServiceComponent,
  HeaderFooterFixedcloseLayoutComponent,
  HeaderLayoutComponent,
  SendPasswordComponent,
  SimpleDialogComponent,
  ShippingMethodComponent,
  IncorrectPasswordComponent,
  SearchInputComponent,
  DigitalGoodsComponent,
  TableComponent,
  MenuButtonComponent,
  ProductCardTitleComponent,
  ProductCardPriceComponent,
  ProductCardFooterComponent,
  ProductCardTagComponent,
  ProductCardTypeComponent,
  ProductCardOldPriceComponent,
  ProductCardRowWrapperComponent,
  ProductCardComponent,
  ProductCardColumnWrapperComponent,
  ProductCardRowComponent,
  ProductCardColumnComponent,
  HelpContactComponent,
  ProductCardSubTitleComponent,
  ProductCardIconComponent,
  ProductCardBadgeComponent,
  MemberAddAccountComponent,
  HeaderInlineCloseLayoutComponent,
  IconSelectComponent,
  AccountPermissionsComponent,
  ApplyToChangeComponent,
  LabelRadioComponent,
  StatusFilterComponent,
  StatusFilterDirective,
  StatusCardComponent,
  StatusItemDirective,
  BonusDueComponent,
  BonusDetailComponent,
  ChecboxTermsOfUseComponent,
  AccountPermissionsComponent,
  StatusTypeComponent,
  BonusDueComponent,
  BonusDetailComponent,
  TagComponent,
  StatusTagComponent,
  AddBillShippingAddressComponent,
  DeleteAddressComponent,
  CountInputComponent,
  CreateAddressComponent,
  CreateDeliveryRemarkComponent,
  TextareaInputComponent,
  SearchRadiusInputComponent,
  DetailItemComponent,
  TitleComponent,
  TableContainerComponent,
  InvoiceDeliveryComponent,
  MobileTableContainerComponent,
  MobileTableItemComponent,
  ShippingNoComponent,
  SelectProductComponent,
  IncrementInputComponent,
  SearchBarComponent,
  BlackTextDialogComponent,
  InfoNotificationComponent,
  MemberResetPasswordComponent,
  DiscardChangesComponent,
  OrderStatusDescriptionComponent,
  OrderTrackingComponent,
  DateInputComponent,
  PrepayComponent,
  SerialListComponent,
  SerialDetailComponent,
  FilterFormComponent,
  ProductListFilterComponent,
  ProductListFilterMobileComponent,
  ScrollAnchorDirective,
  ScrollManagerDirective,
  ScrollSectionDirective,
  ProductAddedToShoppingCartComponent,
  BreadcrumbComponent,
  LoaderComponent,
  ProductCommodityChangeComponent,
  ProductCommodityChangeCancelCartComponent,
  ProductCommodityPhoneConfirmComponent,
  ProductCommodityCancelConfirmComponent,
  ProductCommodityPlanComponent,
  ArrivalNoticeComponent,
  UniqByPipe,
  ContactBusinessComponent,
  ProductRemindMeComponent,
  ProductDirectionsComponent,
  WelfareProductsComponent,
  SelectOptionPipe,
  PromotionOptionPipe,
  TotalPricePipe,
  AveragePricePipe,
  PromoPricePipe,
  GeneralComboPricePipe,
  BulkLastSettingPricePipe,
  ProductListPromosPipe,
  PromotionNamePipe,
  ProductCommodityDeleteNotifyComponent,
  CommonCancelConfirmComponent,
  SelectedDetailCardComponent,
  DiscountCardComponent,
  ImagesCardComponent,
  ProductDetailCardComponent,
  OrderCardComponent,
  BulkCardComponent,
  DealerViewComponent,
  HomePopupComponent,
  AdvancedSearchViewComponent,
  SearchHighlightPipe,
  SearchBottomSheetComponent,
  ProductComparisonComponent,
  ProductControlComponent,
  SortMobileDialogComponent,
  ProductListFilterMobileDialogsComponent,
  CancelOrderDialogComponent,
  AppLoadingMaskComponent
];

@NgModule({
  declarations: [
    ...Components,
    ProductEditFilterComponent,
    ProductModifyFilterComponent,
    ProductDeleteFilterComponent,
    ProductFilterModifierComponent,
    ProductSaveFilterComponent,
    ProductFilterLimitedComponent,
    PlusMinusInputComponent,
    OrderPrintSummaryComponent,
    OrderCancelReasonComponent,
    TaxPipe,
    MaxBuyMessagePipe,
    FixedNavDatePipe,
  ],
  providers: [CurrencyPipe, UniqByPipe],
  imports: [
    ShareMaterialModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    SwiperModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ShareMaterialModule,
    TableDirective,
    DynamicFieldDirective,
    ...Components,
    PlusMinusInputComponent,
    TaxPipe,
    MaxBuyMessagePipe,
    FixedNavDatePipe,
  ],
})
export class SharedModule {}
