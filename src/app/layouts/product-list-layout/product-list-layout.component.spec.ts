import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListLayoutComponent } from './product-list-layout.component';

describe('ProductListLayoutComponent', () => {
  let component: ProductListLayoutComponent;
  let fixture: ComponentFixture<ProductListLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductListLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
