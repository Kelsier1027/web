import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTableItemComponent } from './mobile-table-item.component';

describe('MobileTableItemComponent', () => {
  let component: MobileTableItemComponent;
  let fixture: ComponentFixture<MobileTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTableItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
