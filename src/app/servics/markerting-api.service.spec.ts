import { TestBed } from '@angular/core/testing';

import { MarkertingAPIService } from './markerting-api.service';

describe('MarkertingAPIService', () => {
  let service: MarkertingAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkertingAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
