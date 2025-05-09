import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDetailCardComponent } from './selected-detail-card.component';

describe('SelectedDetailCardComponent', () => {
  let component: SelectedDetailCardComponent;
  let fixture: ComponentFixture<SelectedDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDetailCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
