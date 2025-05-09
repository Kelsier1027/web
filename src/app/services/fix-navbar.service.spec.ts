import { TestBed } from '@angular/core/testing';

import { FixNavBarService } from './fix-navbar.service';

describe('FixNavBarService', () => {
  let service: FixNavBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixNavBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
