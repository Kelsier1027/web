import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedLikesProductsComponent } from './recommended-likes-products.component';

describe('RecommendedLikesProductsComponent', () => {
  let component: RecommendedLikesProductsComponent;
  let fixture: ComponentFixture<RecommendedLikesProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedLikesProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedLikesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
