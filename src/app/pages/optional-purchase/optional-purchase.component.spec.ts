import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalPurchaseComponent } from './optional-purchase.component';

describe('OptionalPurchaseComponent', () => {
  let component: OptionalPurchaseComponent;
  let fixture: ComponentFixture<OptionalPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionalPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
