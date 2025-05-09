import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityChangeComponent } from './product-commodity-change.component';

describe('ProductCommodityChangeComponent', () => {
  let component: ProductCommodityChangeComponent;
  let fixture: ComponentFixture<ProductCommodityChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
