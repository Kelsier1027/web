import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingNoComponent } from './shipping-no.component';

describe('ShippingNoComponent', () => {
  let component: ShippingNoComponent;
  let fixture: ComponentFixture<ShippingNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
