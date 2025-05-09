import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalNoticeComponent } from './arrival-notice.component';

describe('ArrivalNoticeComponent', () => {
  let component: ArrivalNoticeComponent;
  let fixture: ComponentFixture<ArrivalNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrivalNoticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrivalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
