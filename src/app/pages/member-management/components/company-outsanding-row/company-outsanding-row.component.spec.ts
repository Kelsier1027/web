import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOutsandingRowComponent } from './company-outsanding-row.component';

describe('CompanyOutsandingRowComponent', () => {
  let component: CompanyOutsandingRowComponent;
  let fixture: ComponentFixture<CompanyOutsandingRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyOutsandingRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOutsandingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
