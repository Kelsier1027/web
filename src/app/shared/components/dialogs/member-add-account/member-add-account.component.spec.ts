import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAddAccountComponent } from './member-add-account.component';

describe('MemberAddAccountComponent', () => {
  let component: MemberAddAccountComponent;
  let fixture: ComponentFixture<MemberAddAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberAddAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
