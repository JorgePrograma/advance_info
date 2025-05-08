import { TestBed } from '@angular/core/testing';

import { ProcessTransactionUpdateService } from './process-transaction-update.service';

describe('ProcessTransactionUpdateService', () => {
  let service: ProcessTransactionUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessTransactionUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
