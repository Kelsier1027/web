import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepayComponent } from './prepay.component';

describe('PrepayComponent', () => {
  let component: PrepayComponent;
  let fixture: ComponentFixture<PrepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
