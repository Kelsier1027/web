import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRemarkComponent } from './delivery-remark.component';

describe('DeliveryRemarkComponent', () => {
  let component: DeliveryRemarkComponent;
  let fixture: ComponentFixture<DeliveryRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
