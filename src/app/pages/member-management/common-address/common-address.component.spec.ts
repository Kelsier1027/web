import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddressComponent } from './common-address.component';

describe('CommonAddressComponent', () => {
  let component: CommonAddressComponent;
  let fixture: ComponentFixture<CommonAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
