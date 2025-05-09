import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardColumnComponent } from './product-card-column.component';

describe('ProductCardColumnComponent', () => {
  let component: ProductCardColumnComponent;
  let fixture: ComponentFixture<ProductCardColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
