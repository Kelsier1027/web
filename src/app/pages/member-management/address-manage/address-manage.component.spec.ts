import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressManageComponent } from './address-manage.component';

describe('AddressManageComponent', () => {
  let component: AddressManageComponent;
  let fixture: ComponentFixture<AddressManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
