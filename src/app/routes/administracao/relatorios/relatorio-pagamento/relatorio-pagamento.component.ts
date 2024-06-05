import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestRelatorioPedidos } from 'app/models/auxiliar/request-relatorio-pedidos';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { TipoStatusPagamento } from 'app/util/classes/select-tipo-status-pagamento';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCustoService } from '../../centro-de-custo/centro-de-custo.service';
import { TerceiroService } from '../../terceiros/terceiro.service';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';

@Component({
  selector: 'app-administracao-relatorios-relatorio-pagamento',
  templateUrl: './relatorio-pagamento.component.html',
  styleUrls: ['./relatorio-pagamento.component.scss']
})
export class AdministracaoRelatoriosRelatorioPagamentoComponent implements OnInit {

  pagamentos: any = [];
  idPedido: number = 0
  listaTipoStatusPagamento: any
  isPrimeiraConsulta: boolean = true;
  listaUsuarios: Usuario[] = []
  listaFornecedores: Terceiro[] = []
  listaCentroCusto: CentroDeCusto[] = []
  listaFuncionarios: any[] = []
  chartWidth: number = 0
  chartHeight: number = 0
  dataGrafico: { name: string, value: number }[] = [];



  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Períodos';
  showYAxisLabel = true;
  yAxisLabel = 'Valor';

  colorScheme = {
    domain: ['#ffffff'] // Cor branca para o texto
  };

  single: any[] | undefined;
  multi: any[] | undefined;




  onSelect(event: any) {
    //console.log(event);
  }

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private centroService: CentroDeCustoService,
    private terceiroService: TerceiroService) {
    // Object.assign(this, { single })

  }

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
    this.setChartDimensions()
    this.isRadio = history.state.relatorio;
    if(!this.isRadio){
      this.isRadio = history.state.relatorioPagamento;
    }

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

    this.listaTipoStatusPagamento = TipoStatusPagamento.statusPagamento
    this.getCurrentDate()
    this.preencheListaCentros()
    this.preencheListaUsuarios()
    this.preencheListaFornecedoresEFuncionarios()
    this.consultarPedidos()
  }

  setChartDimensions() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    this.chartWidth = screenWidth >= 768 ? screenWidth * 0.8 : screenWidth * 0.9;
    this.chartHeight = screenHeight >= 768 ? screenHeight * 0.5 : screenHeight * 0.4;
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
    this.idPedido = pedido.pedidoId

    if (pedido.terceiro) {
      if (pedido.tipoTerceiro == 0) {
        this.router.navigate(['/pedido/funcionario'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
      }
      if (pedido.tipoTerceiro == 1) {
        this.router.navigate(['/pedido/fornecedor'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
      }
    } else if (pedido.usuario) {
      this.router.navigate(['/pedido/adicionar'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    }
  }

  verPedidoDaParcela(parcela: any) {
    this.pedidoService.getPedidoPorParcelaId(parcela.id).subscribe(
      (pedido: any) => {
        if (pedido.formaPagamento[0].terceiro == null) {
          if (pedido.usuario.id == pedido.usuarioSolicitou.id) {
            this.router.navigate(['/pedido/adicionar'], { state: { id: pedido.id, relatorioPagamento: 'relatorio' } });
          }else{
            this.router.navigate(['/pedido/usuario'], { state: { id: pedido.id, relatorioPagamento: 'relatorio' } });
          }
        } else if (pedido.formaPagamento[0].terceiro) {
          if (pedido.formaPagamento[0].terceiro.tipoTerceiro == 0) {
            this.router.navigate(['/pedido/funcionario'], { state: { id: pedido.id, relatorioPagamento: 'relatorio' } });
          }
          if (pedido.formaPagamento[0].terceiro.tipoTerceiro == 1) {
            this.router.navigate(['/pedido/fornecedor'], { state: { id: pedido.id, relatorioPagamento: 'relatorio' } });
          }
        }
      }
    )
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
  valorTotal: any
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
    this.pedidoService.getPagamentosPorDataAdm(requestRelatorioPedido, 0,0).subscribe(
      (data: any) => {
        this.pagamentos = data;
        if (this.pagamentos.dadosGrafico != undefined && this.pagamentos.dadosGrafico != null) {
          this.dataGrafico = this.pagamentos.dadosGrafico.map((item: any) => ({
            name: this.formatarData(item.x),
            value: parseFloat(item.y.replace(',', '.'))
          }));
          this.valorTotal = this.pagamentos.dadosGrafico.reduce((total: number, item: { y: string; }) => {
            const valorNumerico = parseFloat(item.y.replace(',', '.'));
            return total + valorNumerico;
          }, 0);
        } else {
          this.dataGrafico = [];
          this.valorTotal = 0;
        }

        if (!this.isPrimeiraConsulta) {
          if (this.pagamentos.listaParcelas.length === 0) {
            this.toastr.warning('Nenhum pagamento encontrado', 'Atenção')
          }
        }
        this.isPrimeiraConsulta = false;
        // this.totalItensEncontrados = this.pagamentos.totalItems ? this.pagamentos.totalItems : 0
        // this.totalPages = Math.ceil(this.totalItensEncontrados / this.itemsPerPage);
        // this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        // this.updatePagedPedidos();
      }
    )
  }

  private formatarData(date: string): string {
    const dataAtual = new Date(date);
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();

    return `${dia}-${mes}-${ano}`;
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


  // currentPage = 0;
  // itemsPerPage = 10;
  // totalPages = 1;
  // pages: number[] = [];
  // pagedPedidos: any[] = [];
  // totalItensEncontrados: number = 0;

  // onItemsPerPageChange() {
  //   this.currentPage = 0;
  //   this.consultarPedidos();
  // }

  // updatePagedPedidos() {
  //   const startIndex = this.currentPage * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.pagedPedidos = this.pagamentos.items.slice(startIndex, endIndex);
  // }

  // changePage(page: number) {
  //   if (page >= 0 && page < this.totalPages) {
  //     this.currentPage = page;
  //     this.consultarPedidos();
  //   }
  // }

}
