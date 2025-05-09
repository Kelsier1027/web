import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderNoticeComponent } from './home-header-notice.component';

describe('HomeHeaderNoticeComponent', () => {
  let component: HomeHeaderNoticeComponent;
  let fixture: ComponentFixture<HomeHeaderNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderNoticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
