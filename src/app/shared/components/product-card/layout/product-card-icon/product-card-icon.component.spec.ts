import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardIconComponent } from './product-card-icon.component';

describe('ProductCardIconComponent', () => {
  let component: ProductCardIconComponent;
  let fixture: ComponentFixture<ProductCardIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
