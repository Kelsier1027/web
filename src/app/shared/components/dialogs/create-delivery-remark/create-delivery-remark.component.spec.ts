import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeliveryRemarkComponent } from './create-delivery-remark.component';

describe('CreateDeliveryRemarkComponent', () => {
  let component: CreateDeliveryRemarkComponent;
  let fixture: ComponentFixture<CreateDeliveryRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeliveryRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDeliveryRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
