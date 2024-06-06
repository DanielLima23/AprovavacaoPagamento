import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestRelatorioPedidos } from 'app/models/auxiliar/request-relatorio-pedidos';
import { TipoStatusPagamento } from 'app/util/classes/select-tipo-status-pagamento';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../pedido.service';
import { TipoStatusPedido } from 'app/util/classes/select-tipo-status-pedido';

@Component({
  selector: 'app-pedido-funcionario-consultar',
  templateUrl: './funcionario-consultar.component.html',
  styleUrls: ['./funcionario-consultar.component.scss']
})
export class PedidoFuncionarioConsultarComponent implements OnInit {

  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos: any = [];
  idPedido: number = 0
  listaTipoStatusPagamento: any
  isPrimeiraConsulta: boolean = true;

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  public consultarPedidoForm: UntypedFormGroup = new UntypedFormGroup({
    dataInicio: new UntypedFormControl(undefined),
    dataFim: new UntypedFormControl(undefined),
    statusPagamento: new UntypedFormControl(99),
    filtraStatusPagamento: new UntypedFormControl(false)
  });

  ngOnInit() {
    this.listaTipoStatusPagamento = TipoStatusPedido.statusPedido
    this.getCurrentDate()
    this.consultarPedidos()
  }

  adicionar() {
    this.router.navigate(['/pedido/funcionario']);
  }

  verPedido(id: number) {
    this.idPedido = id
    this.router.navigate(['/pedido/funcionario'], { state: { id: id } });
  }

  // preencheListaPedidos() {
  //   this.pedidoService.getListPedidosUsuario().subscribe(data => {
  //     this.pedidos = data
  //   })
  // }


  getCurrentDate(): void {
    const dataFim = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const dataInicio = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    this.consultarPedidoForm.get('dataInicio')?.setValue(dataInicio);
    this.consultarPedidoForm.get('dataFim')?.setValue(dataFim);
  }

  consultarPedidos() {
    const requestRelatorioPedido = new RequestRelatorioPedidos()
    requestRelatorioPedido.dataInicio= this.consultarPedidoForm.get('dataInicio')?.value
    requestRelatorioPedido.dataFim = this.consultarPedidoForm.get('dataFim')?.value + 'T23:59:59'
    requestRelatorioPedido.statusPagamento = this.consultarPedidoForm.get('statusPagamento')?.value
    requestRelatorioPedido.filtraStatusPagamento = this.consultarPedidoForm.get('filtraStatusPagamento')?.value
    requestRelatorioPedido.terceiro = true
    requestRelatorioPedido.tipoTerceiro = 0

    this.pedidoService.getPedidosUsuarioPorData(requestRelatorioPedido, this.currentPage, this.itemsPerPage).subscribe(
      (data: any[]) => {
        this.pedidos = data;
        if (!this.isPrimeiraConsulta) {
          if (this.pedidos.totalItems === 0) {
            this.toastr.warning('Nenhum pedido encontrado', 'Atenção')
          }
        }
        this.isPrimeiraConsulta = false;
        this.totalItensEncontrados = this.pedidos.totalItems ? this.pedidos.totalItems : 0
        this.totalPages = Math.ceil(this.totalItensEncontrados / this.itemsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.updatePagedPedidos();
      }
    )
  }

  filtraStatusPagamento() {
    const statusPagamento = this.consultarPedidoForm.get('statusPagamento')?.value;
    if (statusPagamento === 99) {
      this.consultarPedidoForm.get('filtraStatusPagamento')?.setValue(false);
    } else {
      this.consultarPedidoForm.get('filtraStatusPagamento')?.setValue(true);
    }
  }

  currentPage = 0;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];
  pagedPedidos: any[] = [];
  totalItensEncontrados: number = 0;

  onItemsPerPageChange() {
    this.currentPage = 0;
    this.consultarPedidos();
  }

  updatePagedPedidos() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedPedidos = this.pedidos.items.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.consultarPedidos();
    }
  }

  isSelectOpen: boolean = false;

  fecharSelectItensPorPagina() {
    const selectElement = document.getElementById('itemsPerPage');
    if (selectElement) {
      selectElement.classList.remove('open');
      this.isSelectOpen = false
    }
  }

  abrirOuFecharSelectItensPorPagina() {
    const selectElement = document.getElementById('itemsPerPage');
    if (selectElement) {
      if (selectElement.classList.contains('open')) {
        this.fecharSelectItensPorPagina()
      } else {
        this.abrirSelectItensPorPagina()
      }

    }
  }

  blurSelectItensPorPagina() {
    this.fecharSelectItensPorPagina()
  }

  abrirSelectItensPorPagina() {
    const selectElement = document.getElementById('itemsPerPage');
    if (selectElement) {
      selectElement.classList.add('open');
      this.isSelectOpen = true
    }
  }

}
