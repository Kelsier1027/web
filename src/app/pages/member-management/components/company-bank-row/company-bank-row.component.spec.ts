import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBankRowComponent } from './company-bank-row.component';

describe('CompanyBankRowComponent', () => {
  let component: CompanyBankRowComponent;
  let fixture: ComponentFixture<CompanyBankRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyBankRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBankRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
