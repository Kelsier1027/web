import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityPhoneConfirmComponent } from './product-commodity-phone-confirm.component';

describe('ProductCommodityPhoneConfirmComponent', () => {
  let component: ProductCommodityPhoneConfirmComponent;
  let fixture: ComponentFixture<ProductCommodityPhoneConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityPhoneConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityPhoneConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
