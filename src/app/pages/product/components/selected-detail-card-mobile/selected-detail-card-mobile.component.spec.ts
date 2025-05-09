import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDetailCardMobileComponent } from './selected-detail-card-mobile.component';

describe('SelectedDetailCardMobileComponent', () => {
  let component: SelectedDetailCardMobileComponent;
  let fixture: ComponentFixture<SelectedDetailCardMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDetailCardMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedDetailCardMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
