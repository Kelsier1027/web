import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialDetailComponent } from './serial-detail.component';

describe('SerialDetailComponent', () => {
  let component: SerialDetailComponent;
  let fixture: ComponentFixture<SerialDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerialDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
