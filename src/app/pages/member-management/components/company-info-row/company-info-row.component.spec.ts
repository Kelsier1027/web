import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoRowComponent } from './company-info-row.component';

describe('CompanyInfoRowComponent', () => {
  let component: CompanyInfoRowComponent;
  let fixture: ComponentFixture<CompanyInfoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyInfoRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInfoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
