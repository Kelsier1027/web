import { TestBed } from '@angular/core/testing';

import { SalesMemberAccessGuard } from './sales-member-access.guard';

describe('SalesMemberAccessGuard', () => {
  let guard: SalesMemberAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SalesMemberAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
