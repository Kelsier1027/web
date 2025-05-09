import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonProblemRowComponent } from './common-problem-row.component';

describe('CommonProblemRowComponent', () => {
  let component: CommonProblemRowComponent;
  let fixture: ComponentFixture<CommonProblemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonProblemRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonProblemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
