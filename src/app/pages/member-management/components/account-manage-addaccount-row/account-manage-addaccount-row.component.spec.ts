import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManageAddaccountRowComponent } from './account-manage-addaccount-row.component';

describe('AccountManageAddaccountRowComponent', () => {
  let component: AccountManageAddaccountRowComponent;
  let fixture: ComponentFixture<AccountManageAddaccountRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountManageAddaccountRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManageAddaccountRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
