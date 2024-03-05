import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroDeCustoAdicionarComponent } from './adicionar.component';

describe('CentroDeCustoAdicionarComponent', () => {
  let component: CentroDeCustoAdicionarComponent;
  let fixture: ComponentFixture<CentroDeCustoAdicionarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroDeCustoAdicionarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroDeCustoAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
