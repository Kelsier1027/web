import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecboxTermsOfUseComponent } from './checbox-terms-of-use.component';

describe('ChecboxTermsOfUseComponent', () => {
  let component: ChecboxTermsOfUseComponent;
  let fixture: ComponentFixture<ChecboxTermsOfUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecboxTermsOfUseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecboxTermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
