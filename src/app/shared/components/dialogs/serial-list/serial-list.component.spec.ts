import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialListComponent } from './serial-list.component';

describe('SerialListComponent', () => {
  let component: SerialListComponent;
  let fixture: ComponentFixture<SerialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
