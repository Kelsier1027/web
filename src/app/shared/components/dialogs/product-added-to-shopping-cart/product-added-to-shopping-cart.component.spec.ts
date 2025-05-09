import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddedToShoppingCartComponent } from './product-added-to-shopping-cart.component';

describe('ProductAddedToShoppingCartComponent', () => {
  let component: ProductAddedToShoppingCartComponent;
  let fixture: ComponentFixture<ProductAddedToShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAddedToShoppingCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAddedToShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
