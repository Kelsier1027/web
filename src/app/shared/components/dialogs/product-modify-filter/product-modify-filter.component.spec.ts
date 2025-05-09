import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModifyFilterComponent } from './product-modify-filter.component';

describe('ProductModifyFilterComponent', () => {
  let component: ProductModifyFilterComponent;
  let fixture: ComponentFixture<ProductModifyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModifyFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModifyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
