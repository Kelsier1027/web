import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBusinessComponent } from './contact-business.component';

describe('ContactBusinessComponent', () => {
  let component: ContactBusinessComponent;
  let fixture: ComponentFixture<ContactBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactBusinessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
