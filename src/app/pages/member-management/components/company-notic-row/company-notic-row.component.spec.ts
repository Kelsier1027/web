import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNoticRowComponent } from './company-notic-row.component';

describe('CompanyNoticRowComponent', () => {
  let component: CompanyNoticRowComponent;
  let fixture: ComponentFixture<CompanyNoticRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyNoticRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyNoticRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
