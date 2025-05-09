import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePopupComponent } from './home-popup.component';

describe('HomePopupComponent', () => {
  let component: HomePopupComponent;
  let fixture: ComponentFixture<HomePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
