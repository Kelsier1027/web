import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderSlideshowComponent } from './home-header-slideshow.component';

describe('HomeHeaderSlideshowComponent', () => {
  let component: HomeHeaderSlideshowComponent;
  let fixture: ComponentFixture<HomeHeaderSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderSlideshowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
