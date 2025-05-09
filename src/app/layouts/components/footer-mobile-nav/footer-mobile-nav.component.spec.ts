import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMobileNavComponent } from './footer-mobile-nav.component';

describe('FooterMobileNavComponent', () => {
  let component: FooterMobileNavComponent;
  let fixture: ComponentFixture<FooterMobileNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterMobileNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMobileNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
