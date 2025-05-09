import { TestBed } from '@angular/core/testing';

import { CheckoutUtilService } from './checkout-util.service';

describe('CheckoutUtilService', () => {
  let service: CheckoutUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
