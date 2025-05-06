import { TestBed } from '@angular/core/testing';

import { UserServiceList } from './user.service';

describe('UserService', () => {
  let service: UserServiceList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServiceList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
