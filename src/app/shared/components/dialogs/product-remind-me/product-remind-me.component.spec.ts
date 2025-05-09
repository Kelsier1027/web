import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRemindMeComponent } from './product-remind-me.component';

describe('ProductRemindMeComponent', () => {
  let component: ProductRemindMeComponent;
  let fixture: ComponentFixture<ProductRemindMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRemindMeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRemindMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
