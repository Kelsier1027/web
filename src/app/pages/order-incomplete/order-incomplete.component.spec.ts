import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIncompleteComponent } from './order-incomplete.component';

describe('OrderIncompleteComponent', () => {
  let component: OrderIncompleteComponent;
  let fixture: ComponentFixture<OrderIncompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderIncompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderIncompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
