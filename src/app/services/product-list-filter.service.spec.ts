import { TestBed } from '@angular/core/testing';
import { ProductListFilterService } from './product-list-filter.service';

describe('ProductListFilterService', () => {
  let service: ProductListFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
