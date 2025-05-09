import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonProblemComponent } from './common-problem.component';

describe('CommonProblemComponent', () => {
  let component: CommonProblemComponent;
  let fixture: ComponentFixture<CommonProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonProblemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
