import { TestBed } from '@angular/core/testing';

import { PasswordParamaterService } from './password-paramater.service';

describe('PasswordParamaterService', () => {
  let service: PasswordParamaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordParamaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
