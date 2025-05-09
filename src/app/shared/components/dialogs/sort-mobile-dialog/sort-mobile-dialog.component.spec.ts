import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortMobileDialogComponent } from './sort-mobile-dialog.component';

describe('SortMobileDialogComponent', () => {
  let component: SortMobileDialogComponent;
  let fixture: ComponentFixture<SortMobileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortMobileDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortMobileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
