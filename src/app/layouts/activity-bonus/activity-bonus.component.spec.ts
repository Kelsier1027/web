import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBonusComponent } from './activity-bonus.component';

describe('ActivityBonusComponent', () => {
  let component: ActivityBonusComponent;
  let fixture: ComponentFixture<ActivityBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityBonusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
