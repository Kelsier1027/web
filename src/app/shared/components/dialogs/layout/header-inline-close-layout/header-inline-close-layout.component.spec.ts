import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInlineCloseLayoutComponent } from './header-inline-close-layout.component';

describe('HeaderInlineCloseLayoutComponent', () => {
  let component: HeaderInlineCloseLayoutComponent;
  let fixture: ComponentFixture<HeaderInlineCloseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderInlineCloseLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInlineCloseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
