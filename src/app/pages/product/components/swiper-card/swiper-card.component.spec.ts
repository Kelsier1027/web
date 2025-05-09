import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperCardComponent } from './swiper-card.component';

describe('SwiperCardComponent', () => {
  let component: SwiperCardComponent;
  let fixture: ComponentFixture<SwiperCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
