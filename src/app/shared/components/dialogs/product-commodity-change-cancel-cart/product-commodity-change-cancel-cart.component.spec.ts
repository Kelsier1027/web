import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityChangeCancelCartComponent } from './product-commodity-change-cancel-cart.component';

describe('ProductCommodityChangeCancelCartComponent', () => {
  let component: ProductCommodityChangeCancelCartComponent;
  let fixture: ComponentFixture<ProductCommodityChangeCancelCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityChangeCancelCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityChangeCancelCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
