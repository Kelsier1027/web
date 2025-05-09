import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNotificationComponent } from './info-notification.component';

describe('InfoNotificationComponent', () => {
  let component: InfoNotificationComponent;
  let fixture: ComponentFixture<InfoNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
