import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockNoticeComponent } from './stock-notice.component';

describe('StockNoticeComponent', () => {
  let component: StockNoticeComponent;
  let fixture: ComponentFixture<StockNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockNoticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
