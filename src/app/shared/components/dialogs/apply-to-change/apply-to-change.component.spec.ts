import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyToChangeComponent } from './apply-to-change.component';

describe('ApplyToChangeComponent', () => {
  let component: ApplyToChangeComponent;
  let fixture: ComponentFixture<ApplyToChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyToChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyToChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
