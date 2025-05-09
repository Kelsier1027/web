import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityPlanComponent } from './product-commodity-plan.component';

describe('ProductCommodityPlanComponent', () => {
  let component: ProductCommodityPlanComponent;
  let fixture: ComponentFixture<ProductCommodityPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
