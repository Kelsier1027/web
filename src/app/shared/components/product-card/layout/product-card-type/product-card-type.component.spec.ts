import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardTypeComponent } from './product-card-type.component';

describe('ProductCardTypeComponent', () => {
  let component: ProductCardTypeComponent;
  let fixture: ComponentFixture<ProductCardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
