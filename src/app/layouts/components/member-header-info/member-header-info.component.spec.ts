import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHeaderInfoComponent } from './member-header-info.component';

describe('MemberHeaderInfoComponent', () => {
  let component: MemberHeaderInfoComponent;
  let fixture: ComponentFixture<MemberHeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberHeaderInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
