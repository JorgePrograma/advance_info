import { TestBed } from '@angular/core/testing';

import { StepConfigurationService } from './step-configuration.service';

describe('StepConfigurationService', () => {
  let service: StepConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
