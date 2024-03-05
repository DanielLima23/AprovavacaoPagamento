import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFornecedorComponent } from './fornecedor.component';

describe('PedidoFornecedorComponent', () => {
  let component: PedidoFornecedorComponent;
  let fixture: ComponentFixture<PedidoFornecedorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFornecedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
