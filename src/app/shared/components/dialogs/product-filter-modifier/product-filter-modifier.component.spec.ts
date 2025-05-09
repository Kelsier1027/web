import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterModifierComponent } from './product-filter-modifier.component';

describe('ProductFilterModifierComponent', () => {
  let component: ProductFilterModifierComponent;
  let fixture: ComponentFixture<ProductFilterModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFilterModifierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFilterModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
