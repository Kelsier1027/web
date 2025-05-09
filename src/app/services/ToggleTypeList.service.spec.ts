import { TestBed } from '@angular/core/testing';

import { ToggleTypeListService } from './ToggleTypeList.service';

describe('ToggleTypeListService', () => {
  let service: ToggleTypeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleTypeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
