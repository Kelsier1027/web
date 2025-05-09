import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCardComponent } from './bulk-card.component';

describe('BulkCardComponent', () => {
  let component: BulkCardComponent;
  let fixture: ComponentFixture<BulkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
