import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardPriceComponent } from './product-card-price.component';

describe('ProductCardPriceComponent', () => {
  let component: ProductCardPriceComponent;
  let fixture: ComponentFixture<ProductCardPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
