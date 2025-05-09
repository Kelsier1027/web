import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardTitleComponent } from './product-card-title.component';

describe('ProductCardTitleComponent', () => {
  let component: ProductCardTitleComponent;
  let fixture: ComponentFixture<ProductCardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
