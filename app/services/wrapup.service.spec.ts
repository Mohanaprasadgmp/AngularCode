import { TestBed } from '@angular/core/testing';

import { WrapupService } from './wrapup.service';

describe('WrapupService', () => {
  let service: WrapupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WrapupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
