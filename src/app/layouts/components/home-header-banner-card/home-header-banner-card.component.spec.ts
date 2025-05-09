import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderBannerCardComponent } from './home-header-banner-card.component';

describe('HomeHeaderBannerCardComponent', () => {
  let component: HomeHeaderBannerCardComponent;
  let fixture: ComponentFixture<HomeHeaderBannerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderBannerCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderBannerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
