import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingChipListComponent } from './shopping-chip-list.component';

describe('ShoppingChipListComponent', () => {
  let component: ShoppingChipListComponent;
  let fixture: ComponentFixture<ShoppingChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingChipListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
