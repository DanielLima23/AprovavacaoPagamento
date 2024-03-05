import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorAdicionarComponent } from './adicionar.component';

describe('FornecedorAdicionarComponent', () => {
  let component: FornecedorAdicionarComponent;
  let fixture: ComponentFixture<FornecedorAdicionarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorAdicionarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
