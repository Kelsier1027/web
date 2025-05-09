import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRemarkDialogComponent } from './delivery-remark-dialog.component';

describe('DeliveryRemarkDialogComponent', () => {
  let component: DeliveryRemarkDialogComponent;
  let fixture: ComponentFixture<DeliveryRemarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryRemarkDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryRemarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
