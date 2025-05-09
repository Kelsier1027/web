import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('CartService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
