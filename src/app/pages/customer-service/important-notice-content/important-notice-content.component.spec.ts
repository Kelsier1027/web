import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantNoticeContentComponent } from './important-notice-content.component';

describe('ImportantNoticeContentComponent', () => {
  let component: ImportantNoticeContentComponent;
  let fixture: ComponentFixture<ImportantNoticeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantNoticeContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportantNoticeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
