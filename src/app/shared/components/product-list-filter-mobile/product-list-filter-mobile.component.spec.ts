import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListFilterMobileComponent } from './product-list-filter-mobile.component';

describe('ProductListFilterMobileComponent', () => {
  let component: ProductListFilterMobileComponent;
  let fixture: ComponentFixture<ProductListFilterMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListFilterMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
