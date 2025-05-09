import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNoComponent } from './bill-no.component';

describe('BillNoComponent', () => {
  let component: BillNoComponent;
  let fixture: ComponentFixture<BillNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
