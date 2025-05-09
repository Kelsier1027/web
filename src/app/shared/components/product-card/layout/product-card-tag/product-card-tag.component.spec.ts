import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardTagComponent } from './product-card-tag.component';

describe('ProductCardTagComponent', () => {
  let component: ProductCardTagComponent;
  let fixture: ComponentFixture<ProductCardTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
