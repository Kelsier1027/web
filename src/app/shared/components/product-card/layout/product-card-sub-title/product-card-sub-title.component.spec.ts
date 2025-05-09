import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardSubTitleComponent } from './product-card-sub-title.component';

describe('ProductCardSubTitleComponent', () => {
  let component: ProductCardSubTitleComponent;
  let fixture: ComponentFixture<ProductCardSubTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCardSubTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardSubTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
