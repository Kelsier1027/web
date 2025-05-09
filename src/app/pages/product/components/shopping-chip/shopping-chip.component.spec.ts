import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingChipComponent } from './shopping-chip.component';

describe('ShoppingChipComponent', () => {
  let component: ShoppingChipComponent;
  let fixture: ComponentFixture<ShoppingChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
