import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddressDialogComponent } from './common-address-dialog.component';

describe('CommonAddressDialogComponent', () => {
  let component: CommonAddressDialogComponent;
  let fixture: ComponentFixture<CommonAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonAddressDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CommonAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
