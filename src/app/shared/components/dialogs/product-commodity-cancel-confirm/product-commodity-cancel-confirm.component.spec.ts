import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityCancelConfirmComponent } from './product-commodity-cancel-confirm.component';

describe('ProductCommodityCancelConfirmComponent', () => {
  let component: ProductCommodityCancelConfirmComponent;
  let fixture: ComponentFixture<ProductCommodityCancelConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommodityCancelConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityCancelConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
