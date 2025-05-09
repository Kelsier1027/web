import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTypeComponent } from './status-type.component';

describe('StatusTypeComponent', () => {
  let component: StatusTypeComponent;
  let fixture: ComponentFixture<StatusTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
