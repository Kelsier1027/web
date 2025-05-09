import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCancelConfirmComponent } from './common-cancel-confirm.component';

describe('CommonCancelConfirmComponent', () => {
  let component: CommonCancelConfirmComponent;
  let fixture: ComponentFixture<CommonCancelConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCancelConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonCancelConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
