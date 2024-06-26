import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { TipoStatusPagamento } from 'app/util/classes/select-tipo-status-pagamento';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCustoService } from '../../centro-de-custo/centro-de-custo.service';
import { Usuario } from 'app/models/usuario';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { RequestRelatorioPedidos } from 'app/models/auxiliar/request-relatorio-pedidos';
import { Terceiro } from 'app/models/terceiro';
import { TerceiroService } from '../../terceiros/terceiro.service';
import { TipoStatusPedido } from 'app/util/classes/select-tipo-status-pedido';
import { DialogPedidosPorParcelaFornecedorComponent } from 'app/routes/dialog/pedidos-por-parcela-fornecedor/pedidos-por-parcela-fornecedor.component';
import { DialogPedidosPorParcelaFuncionarioComponent } from 'app/routes/dialog/pedidos-por-parcela-funcionario/pedidos-por-parcela-funcionario.component';
import { DialogPedidosPorParcelaOutrosUsuariosComponent } from 'app/routes/dialog/pedidos-por-parcela-outros-usuarios/pedidos-por-parcela-outros-usuarios.component';
import { DialogPedidosPorParcelaComponent } from 'app/routes/dialog/pedidos-por-parcela/pedidos-por-parcela.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Util } from 'app/util/util';

@Component({
  selector: 'app-administracao-relatorios-relatorio-pedido',
  templateUrl: './relatorio-pedido.component.html',
  styleUrls: ['./relatorio-pedido.component.scss']
})
export class AdministracaoRelatoriosRelatorioPedidoComponent implements OnInit {

  pedidos: any = [];
  idPedido: number = 0
  listaTipoStatusPagamento: any
  isPrimeiraConsulta: boolean = true;
  listaUsuarios: Usuario[] = []
  listaFornecedores: Terceiro[] = []
  listaCentroCusto: CentroDeCusto[] = []
  listaFuncionarios: any[] = []
  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private centroService: CentroDeCustoService,
    private terceiroService: TerceiroService,
    private dialog: MatDialog,
    private overlay: Overlay) { }

  public consultarPedidoForm: UntypedFormGroup = new UntypedFormGroup({
    dataInicio: new UntypedFormControl(undefined),
    dataFim: new UntypedFormControl(undefined),
    statusPagamento: new UntypedFormControl(99),
    idCentroDeCusto: new UntypedFormControl(0),
    idUsuario: new UntypedFormControl(0),
    filtraStatusPagamento: new UntypedFormControl(false),
    tipoTerceiro: new UntypedFormControl(0),
    terceiro: new UntypedFormControl(false),
    tipoRelatorio: new UntypedFormControl('usuario'),
    idTerceiro: new UntypedFormControl(0)
  });

  isRadio: any
  ngOnInit() {
    this.isRadio = history.state.relatorio;
    if (this.isRadio != undefined || this.isRadio != null) {
      if (this.isRadio == 'usuario') {
        this.radioUsuario()
      }
      if (this.isRadio == 'fornecedor') {
        this.radioFornecedor()
      }
      if (this.isRadio == 'funcionario') {
        this.radioFuncionario()
      }
      this.consultarPedidoForm.get('tipoRelatorio')?.setValue(this.isRadio)
    }

    this.listaTipoStatusPagamento = TipoStatusPedido.statusPedido
    this.getCurrentDate()
    this.preencheListaCentros()
    this.preencheListaUsuarios()
    this.preencheListaFornecedoresEFuncionarios()
    this.consultarPedidos()

  }

  radioUsuario() {
    this.consultarPedidoForm.get('terceiro')?.setValue(false);
    this.consultarPedidoForm.get('tipoTerceiro')?.setValue(0)
    this.consultarPedidoForm.get('idTerceiro')?.setValue(0)
  }

  radioFuncionario() {
    this.consultarPedidoForm.get('terceiro')?.setValue(true);
    this.consultarPedidoForm.get('idUsuario')?.setValue(0)
    this.consultarPedidoForm.get('tipoTerceiro')?.setValue(0)

  }

  radioFornecedor() {
    this.consultarPedidoForm.get('terceiro')?.setValue(true);
    this.consultarPedidoForm.get('idUsuario')?.setValue(0)
    this.consultarPedidoForm.get('tipoTerceiro')?.setValue(1)

  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  verPedido(pedido: any) {
    // this.idPedido = pedido.pedidoId

    // if (pedido.terceiro) {
    //   if (pedido.tipoTerceiro == 0) {
    //     this.router.navigate(['/pedido/funcionario'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    //   }
    //   if (pedido.tipoTerceiro == 1) {
    //     this.router.navigate(['/pedido/fornecedor'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    //   }
    // } else if (pedido.usuario) {
    //   this.router.navigate(['/pedido/adicionar'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    // }
    this.pedidoService.getPedidoById(pedido.pedidoId).subscribe(
      (pedido: any) => {
        if (pedido.formaPagamento[0].terceiro == null) {
          if (pedido.usuario.id == pedido.usuarioSolicitou.id) {
            this.openDialogPedidoPorParcelaUsuario(pedido.id)
          } else {
            this.openDialogPedidoPorParcelaOutrosUsuario(pedido.id)
          }
        } else if (pedido.formaPagamento[0].terceiro) {
          if (pedido.formaPagamento[0].terceiro.tipoTerceiro == 0) {
            this.openDialogPedidoPorParcelaFuncionario(pedido.id)
          }
          if (pedido.formaPagamento[0].terceiro.tipoTerceiro == 1) {
            this.openDialogPedidoPorParcelaFornecedor(pedido.id)
          }
        }
      }
    )
  }

  openDialogPedidoPorParcelaOutrosUsuario(id: any): void {
    const dialogRef = this.dialog.open(DialogPedidosPorParcelaOutrosUsuariosComponent, {
      data: id,
      width: '50%',
      maxHeight: '90vh',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  openDialogPedidoPorParcelaUsuario(id: any): void {
    const dialogRef = this.dialog.open(DialogPedidosPorParcelaComponent, {
      data: id,
      width: '50%',
      maxHeight: '90vh',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openDialogPedidoPorParcelaFuncionario(id: any): void {
    const dialogRef = this.dialog.open(DialogPedidosPorParcelaFuncionarioComponent, {
      data: id,
      width: '50%',
      maxHeight: '90vh',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openDialogPedidoPorParcelaFornecedor(id: any): void {
    const dialogRef = this.dialog.open(DialogPedidosPorParcelaFornecedorComponent, {
      data: id,
      width: '50%',
      maxHeight: '90vh',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  preencheListaUsuarios() {
    this.centroService.getListaResponsaveis().subscribe(
      (data: Usuario[]) => {
        this.listaUsuarios = data
      }
    )
  }

  preencheListaCentros() {
    this.centroService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  preencheListaFornecedoresEFuncionarios() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFornecedores = data.filter(terceiro => terceiro.tipoTerceiro == 1)
        this.listaFuncionarios = data.filter(terceiro => terceiro.tipoTerceiro == 0)
      }
    )
  }

  getCurrentDate(): void {
    const dataFim = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const dataInicio = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    this.consultarPedidoForm.get('dataInicio')?.setValue(dataInicio);
    this.consultarPedidoForm.get('dataFim')?.setValue(dataFim);
  }

  validaDate(dataInicio: string, dataFim: string): string {
    let validatorDate: Util = new Util()

    if(!validatorDate.isValidDate(dataInicio) && !validatorDate.isValidDate(dataFim)){
      this.consultarPedidoForm.get('dataInicio')?.setErrors({ invalidDate: 'Data início inválida' });
      this.consultarPedidoForm.get('dataFim')?.setErrors({ invalidDate: 'Data final inválida' });
      return 'Datas início e final inválidas';
    }

    if (!validatorDate.isValidDate(dataInicio)) {
      this.consultarPedidoForm.get('dataInicio')?.setErrors({ invalidDate: 'Data início inválida' });
      return 'Data início inválida';
    }

    if (!validatorDate.isValidDate(dataFim)) {
      this.consultarPedidoForm.get('dataFim')?.setErrors({ invalidDate: 'Data final inválida' });
      return 'Data final inválida';
    }
    return ''
  }

  consultarPedidos() {

    const requestRelatorioPedido = new RequestRelatorioPedidos()
    requestRelatorioPedido.dataInicio = this.consultarPedidoForm.get('dataInicio')?.value
    requestRelatorioPedido.dataFim = this.consultarPedidoForm.get('dataFim')?.value + 'T23:59:59'
    requestRelatorioPedido.statusPagamento = this.consultarPedidoForm.get('statusPagamento')?.value
    requestRelatorioPedido.idUsuario = this.consultarPedidoForm.get('idUsuario')?.value
    requestRelatorioPedido.idCentroDeCusto = this.consultarPedidoForm.get('idCentroDeCusto')?.value
    requestRelatorioPedido.filtraStatusPagamento = this.consultarPedidoForm.get('filtraStatusPagamento')?.value
    requestRelatorioPedido.terceiro = this.consultarPedidoForm.get('terceiro')?.value
    requestRelatorioPedido.idTerceiro = this.consultarPedidoForm.get('idTerceiro')?.value
    requestRelatorioPedido.tipoTerceiro = this.consultarPedidoForm.get('tipoTerceiro')?.value

    let msg = this.validaDate(requestRelatorioPedido.dataInicio, requestRelatorioPedido.dataFim)
    if (msg != '') {
      this.toastr.warning(msg, 'Atenção')
      return
    }

    this.pedidoService.getPedidosUsuarioPorDataAdm(requestRelatorioPedido, this.currentPage, this.itemsPerPage).subscribe(
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


  setValorNullCentroDeCusto() {
    const usuarioId = this.consultarPedidoForm.get('idUsuario')?.value;
    const idFuncionario = this.consultarPedidoForm.get('idTerceiro')?.value;

    if (usuarioId > 0 || idFuncionario > 0) {
      //this.consultarPedidoForm.get('centroDeCustoID')?.disable()
      this.consultarPedidoForm.get('idCentroDeCusto')?.setValue(0)

    } else {
      //this.consultarPedidoForm.get('centroDeCustoID')?.enable()

    }
  }

  setValorNullPessoas() {
    const centroDeCustoID = this.consultarPedidoForm.get('idCentroDeCusto')?.value;
    if (centroDeCustoID > 0) {
      //this.consultarPedidoForm.get('centroDeCustoID')?.disable()
      this.consultarPedidoForm.get('idUsuario')?.setValue(0)
      this.consultarPedidoForm.get('idTerceiro')?.setValue(0)


    } else {
      //this.consultarPedidoForm.get('centroDeCustoID')?.enable()

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
