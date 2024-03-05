import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFornecedorConsultarComponent } from './fornecedor-consultar.component';

describe('PedidoFornecedorConsultarComponent', () => {
  let component: PedidoFornecedorConsultarComponent;
  let fixture: ComponentFixture<PedidoFornecedorConsultarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFornecedorConsultarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFornecedorConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
