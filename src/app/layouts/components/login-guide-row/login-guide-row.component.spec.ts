import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGuideRowComponent } from './login-guide-row.component';

describe('LoginGuideRowComponent', () => {
  let component: LoginGuideRowComponent;
  let fixture: ComponentFixture<LoginGuideRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginGuideRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginGuideRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
