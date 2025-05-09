import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStrongDiscountComponent } from './home-strong-discount.component';

describe('HomeStrongDiscountComponent', () => {
  let component: HomeStrongDiscountComponent;
  let fixture: ComponentFixture<HomeStrongDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeStrongDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStrongDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
