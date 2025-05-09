import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusDescriptionComponent } from './order-status-description.component';

describe('OrderStatusDescriptionComponent', () => {
  let component: OrderStatusDescriptionComponent;
  let fixture: ComponentFixture<OrderStatusDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStatusDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
