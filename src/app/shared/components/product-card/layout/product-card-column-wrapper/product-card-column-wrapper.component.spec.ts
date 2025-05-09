import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardColumnWrapperComponent } from './product-card-column-wrapper.component';

describe('ProductCardColumnWrapperComponent', () => {
  let component: ProductCardColumnWrapperComponent;
  let fixture: ComponentFixture<ProductCardColumnWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardColumnWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardColumnWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
