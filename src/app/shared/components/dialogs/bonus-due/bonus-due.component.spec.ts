import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusDueComponent } from './bonus-due.component';

describe('BonusDueComponent', () => {
  let component: BonusDueComponent;
  let fixture: ComponentFixture<BonusDueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusDueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
