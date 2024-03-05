import { TestBed } from '@angular/core/testing';

import { CentroDeCustoService } from './centro-de-custo.service';

describe('CentroDeCustoService', () => {
  let service: CentroDeCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroDeCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
