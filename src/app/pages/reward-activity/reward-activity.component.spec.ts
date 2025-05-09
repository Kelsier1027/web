import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardActivityComponent } from './reward-activity.component';

describe('RewardActivityComponent', () => {
  let component: RewardActivityComponent;
  let fixture: ComponentFixture<RewardActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RewardActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
