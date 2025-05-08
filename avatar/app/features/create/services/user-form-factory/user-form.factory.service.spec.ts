import { TestBed } from '@angular/core/testing';

import { UserFormFactoryService } from './user-form.factory.service';

describe('UserFormFactoryService', () => {
  let service: UserFormFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFormFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
