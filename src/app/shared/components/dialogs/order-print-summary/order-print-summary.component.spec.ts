import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrintSummaryComponent } from './order-print-summary.component';

describe('OrderPrintSummaryComponent', () => {
  let component: OrderPrintSummaryComponent;
  let fixture: ComponentFixture<OrderPrintSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPrintSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPrintSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
