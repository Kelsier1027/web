import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillShippingAddressComponent } from './add-bill-shipping-address.component';

describe('AddBillShippingAddressComponent', () => {
  let component: AddBillShippingAddressComponent;
  let fixture: ComponentFixture<AddBillShippingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBillShippingAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBillShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
