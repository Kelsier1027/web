import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardBadgeComponent } from './product-card-badge.component';

describe('ProductCardBadgeComponent', () => {
  let component: ProductCardBadgeComponent;
  let fixture: ComponentFixture<ProductCardBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
