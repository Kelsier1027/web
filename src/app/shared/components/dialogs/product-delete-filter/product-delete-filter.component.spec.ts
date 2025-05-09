import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDeleteFilterComponent } from './product-delete-filter.component';

describe('ProductDeleteFilterComponent', () => {
  let component: ProductDeleteFilterComponent;
  let fixture: ComponentFixture<ProductDeleteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDeleteFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDeleteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
