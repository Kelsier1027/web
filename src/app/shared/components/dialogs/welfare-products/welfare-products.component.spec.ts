import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareProductsComponent } from './welfare-products.component';

describe('WelfareProductsComponent', () => {
  let component: WelfareProductsComponent;
  let fixture: ComponentFixture<WelfareProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelfareProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelfareProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
