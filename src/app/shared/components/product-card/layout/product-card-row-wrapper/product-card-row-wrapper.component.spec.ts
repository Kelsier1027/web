import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardRowWrapperComponent } from './product-card-row-wrapper.component';

describe('ProductCardRowWrapperComponent', () => {
  let component: ProductCardRowWrapperComponent;
  let fixture: ComponentFixture<ProductCardRowWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardRowWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardRowWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
