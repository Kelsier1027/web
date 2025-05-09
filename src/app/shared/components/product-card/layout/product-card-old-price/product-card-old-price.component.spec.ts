import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardOldPriceComponent } from './product-card-old-price.component';

describe('ProductCardOldPriceComponent', () => {
  let component: ProductCardOldPriceComponent;
  let fixture: ComponentFixture<ProductCardOldPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardOldPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardOldPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
