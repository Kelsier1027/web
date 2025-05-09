import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelReasonComponent } from './order-cancel-reason.component';

describe('OrderCancelReasonComponent', () => {
  let component: OrderCancelReasonComponent;
  let fixture: ComponentFixture<OrderCancelReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCancelReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCancelReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
