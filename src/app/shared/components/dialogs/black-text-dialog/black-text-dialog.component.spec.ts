import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackTextDialogComponent } from './black-text-dialog.component';

describe('BlackTextDialogComponent', () => {
  let component: BlackTextDialogComponent;
  let fixture: ComponentFixture<BlackTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackTextDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
