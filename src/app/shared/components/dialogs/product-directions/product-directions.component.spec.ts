import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDirectionsComponent } from './product-directions.component';

describe('ProductDirectionsComponent', () => {
  let component: ProductDirectionsComponent;
  let fixture: ComponentFixture<ProductDirectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDirectionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
