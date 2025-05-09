import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardRowComponent } from './product-card-row.component';

describe('ProductCardRowComponent', () => {
  let component: ProductCardRowComponent;
  let fixture: ComponentFixture<ProductCardRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
