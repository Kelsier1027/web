import { TestBed } from '@angular/core/testing';

import { DealerViewGuardGuard } from './dealer-view-guard.guard';

describe('DealerViewGuardGuard', () => {
  let guard: DealerViewGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DealerViewGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
