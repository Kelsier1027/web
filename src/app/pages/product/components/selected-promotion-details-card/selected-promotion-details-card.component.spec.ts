import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPromotionDetailsCardComponent } from './selected-promotion-details-card.component';

describe('SelectedPromotionDetailsCardComponent', () => {
  let component: SelectedPromotionDetailsCardComponent;
  let fixture: ComponentFixture<SelectedPromotionDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedPromotionDetailsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedPromotionDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
