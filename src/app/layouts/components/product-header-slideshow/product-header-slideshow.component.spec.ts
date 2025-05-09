import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHeaderSlideshowComponent } from './product-header-slideshow.component';

describe('ProductHeaderSlideshowComponent', () => {
  let component: ProductHeaderSlideshowComponent;
  let fixture: ComponentFixture<ProductHeaderSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductHeaderSlideshowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHeaderSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
