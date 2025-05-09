import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditFilterComponent } from './product-edit-filter.component';

describe('ProductEditFilterComponent', () => {
  let component: ProductEditFilterComponent;
  let fixture: ComponentFixture<ProductEditFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEditFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductEditFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
