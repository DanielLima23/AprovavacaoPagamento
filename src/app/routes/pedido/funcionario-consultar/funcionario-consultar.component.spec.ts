import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFuncionarioConsultarComponent } from './funcionario-consultar.component';

describe('PedidoFuncionarioConsultarComponent', () => {
  let component: PedidoFuncionarioConsultarComponent;
  let fixture: ComponentFixture<PedidoFuncionarioConsultarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFuncionarioConsultarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFuncionarioConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
