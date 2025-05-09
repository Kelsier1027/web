import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHeaderMobileNavComponent } from './member-header-mobile-nav.component';

describe('MemberHeaderMobileNavComponent', () => {
  let component: MemberHeaderMobileNavComponent;
  let fixture: ComponentFixture<MemberHeaderMobileNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberHeaderMobileNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberHeaderMobileNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
