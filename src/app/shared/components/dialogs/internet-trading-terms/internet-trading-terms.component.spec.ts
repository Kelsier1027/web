import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetTradingTermsComponent } from './internet-trading-terms.component';

describe('InternetTradingTermsComponent', () => {
  let component: InternetTradingTermsComponent;
  let fixture: ComponentFixture<InternetTradingTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternetTradingTermsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InternetTradingTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
