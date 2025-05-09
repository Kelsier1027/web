import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelRadioComponent } from './label-radio.component';

describe('LabelRadioComponent', () => {
  let component: LabelRadioComponent;
  let fixture: ComponentFixture<LabelRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelRadioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
