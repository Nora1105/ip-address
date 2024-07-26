import { TestBed } from '@angular/core/testing';

import { LocalIpService } from './local-ip.service';

describe('LocalIpService', () => {
  let service: LocalIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
