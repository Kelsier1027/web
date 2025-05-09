import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideColumnLabelComponent } from './guide-column-label.component';

describe('GuideColumnLabelComponent', () => {
  let component: GuideColumnLabelComponent;
  let fixture: ComponentFixture<GuideColumnLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuideColumnLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuideColumnLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
