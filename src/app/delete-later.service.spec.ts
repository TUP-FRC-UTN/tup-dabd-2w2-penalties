import { TestBed } from '@angular/core/testing';

import { DeleteLaterService } from './delete-later.service';

describe('DeleteLaterService', () => {
  let service: DeleteLaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteLaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
