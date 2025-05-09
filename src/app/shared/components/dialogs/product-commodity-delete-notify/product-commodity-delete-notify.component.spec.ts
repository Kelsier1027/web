import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityDeleteNotifyComponent } from './product-commodity-delete-notify.component';

describe('ProductCommodityDeleteNotifyComponent', () => {
  let component: ProductCommodityDeleteNotifyComponent;
  let fixture: ComponentFixture<ProductCommodityDeleteNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityDeleteNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityDeleteNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
