import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorrectPasswordComponent } from './incorrect-password.component';

describe('IncorrectPasswordComponent', () => {
  let component: IncorrectPasswordComponent;
  let fixture: ComponentFixture<IncorrectPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncorrectPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncorrectPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
