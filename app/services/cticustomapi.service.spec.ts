import { TestBed } from '@angular/core/testing';

import { CticustomapiService } from './cticustomapi.service';

describe('CticustomapiService', () => {
  let service: CticustomapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CticustomapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
