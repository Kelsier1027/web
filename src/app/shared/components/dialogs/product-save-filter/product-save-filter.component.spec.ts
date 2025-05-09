import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaveFilterComponent } from './product-save-filter.component';

describe('ProductSaveFilterComponent', () => {
  let component: ProductSaveFilterComponent;
  let fixture: ComponentFixture<ProductSaveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSaveFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSaveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
