import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNumberComponent } from './order-number.component';

describe('OrderNumberComponent', () => {
  let component: OrderNumberComponent;
  let fixture: ComponentFixture<OrderNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
