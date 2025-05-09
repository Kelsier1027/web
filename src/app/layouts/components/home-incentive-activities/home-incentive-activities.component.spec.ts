import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIncentiveActivitiesComponent } from './home-incentive-activities.component';

describe('HomeIncentiveActivitiesComponent', () => {
  let component: HomeIncentiveActivitiesComponent;
  let fixture: ComponentFixture<HomeIncentiveActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeIncentiveActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeIncentiveActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
