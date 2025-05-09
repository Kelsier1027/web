import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpContactComponent } from './help-contact.component';

describe('HelpContactComponent', () => {
  let component: HelpContactComponent;
  let fixture: ComponentFixture<HelpContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
