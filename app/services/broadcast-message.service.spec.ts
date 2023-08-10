import { TestBed } from '@angular/core/testing';

import { BroadcastMessageService } from './broadcast-message.service';

describe('BroadcastMessageService', () => {
  let service: BroadcastMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
