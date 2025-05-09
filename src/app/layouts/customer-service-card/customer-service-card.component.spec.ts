import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceCardComponent } from './customer-service-card.component';

describe('CustomerServiceCardComponent', () => {
  let component: CustomerServiceCardComponent;
  let fixture: ComponentFixture<CustomerServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServiceCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
