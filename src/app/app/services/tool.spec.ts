import { TestBed } from '@angular/core/testing';

import { Tool } from './tool';

describe('Tool', () => {
  let service: Tool;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tool);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
