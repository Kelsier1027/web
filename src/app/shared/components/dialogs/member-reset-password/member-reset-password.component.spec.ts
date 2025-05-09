import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberResetPasswordComponent } from './member-reset-password.component';

describe('MemberResetPasswordComponent', () => {
  let component: MemberResetPasswordComponent;
  let fixture: ComponentFixture<MemberResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberResetPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
