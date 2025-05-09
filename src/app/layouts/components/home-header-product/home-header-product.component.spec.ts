import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderProductComponent } from './home-header-product.component';

describe('HomeHeaderProductComponent', () => {
  let component: HomeHeaderProductComponent;
  let fixture: ComponentFixture<HomeHeaderProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
