import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterLimitedComponent } from './product-filter-limited.component';

describe('ProductFilterLimitedComponent', () => {
  let component: ProductFilterLimitedComponent;
  let fixture: ComponentFixture<ProductFilterLimitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFilterLimitedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFilterLimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
