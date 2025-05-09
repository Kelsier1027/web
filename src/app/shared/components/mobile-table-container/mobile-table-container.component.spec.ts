import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTableContainerComponent } from './mobile-table-container.component';

describe('MobileTableContainerComponent', () => {
  let component: MobileTableContainerComponent;
  let fixture: ComponentFixture<MobileTableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTableContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
