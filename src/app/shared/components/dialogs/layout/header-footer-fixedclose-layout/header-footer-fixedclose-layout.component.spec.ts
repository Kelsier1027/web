import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFooterFixedcloseLayoutComponent } from './header-footer-fixedclose-layout.component';

describe('HeaderFooterFixedcloseLayoutComponent', () => {
  let component: HeaderFooterFixedcloseLayoutComponent;
  let fixture: ComponentFixture<HeaderFooterFixedcloseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderFooterFixedcloseLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFooterFixedcloseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
