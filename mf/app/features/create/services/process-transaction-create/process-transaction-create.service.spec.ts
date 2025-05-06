import { TestBed } from '@angular/core/testing';

import { ProcessTransactionCreateService } from './process-transaction-create.service';

describe('ProcessTransactionCreateService', () => {
  let service: ProcessTransactionCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessTransactionCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
