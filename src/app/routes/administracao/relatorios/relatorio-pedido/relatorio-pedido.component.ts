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
  listaFuncionarios: Terceiro[] = []
  listaCentroCusto: CentroDeCusto[] = []

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private centroService: CentroDeCustoService,
    private terceiroService: TerceiroService) { }

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
    if(this.isRadio != undefined || this.isRadio != null){
      if(this.isRadio == 'usuario'){
        this.radioUsuario()
      }
      if(this.isRadio == 'funcionario'){
        this.radioFuncionario()
      }
      this.consultarPedidoForm.get('tipoRelatorio')?.setValue(this.isRadio)
    }

     this.listaTipoStatusPagamento = TipoStatusPagamento.statusPagamento
    this.getCurrentDate()
    this.preencheListaCentros()
    this.preencheListaUsuarios()
    this.consultarPedidos()
    this.preencheListaFuncionarios()

  }

  radioUsuario() {
    this.consultarPedidoForm.get('terceiro')?.setValue(false);
    this.consultarPedidoForm.get('tipoTerceiro')?.setValue(0)
    this.consultarPedidoForm.get('idTerceiro')?.setValue(0)
  }

  radioFuncionario() {
    this.consultarPedidoForm.get('terceiro')?.setValue(true);
    this.consultarPedidoForm.get('idUsuario')?.setValue(0)
  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  verPedido(pedido: any) {
    this.idPedido = pedido.pedidoId
    if (pedido.terceiro) {
      this.router.navigate(['/pedido/funcionario'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    } else if (pedido.usuario) {
      this.router.navigate(['/pedido/adicionar'], { state: { id: pedido.pedidoId, relatorio: 'relatorio' } });
    }

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

  preencheListaFuncionarios() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
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
    this.pedidoService.getPedidosUsuarioPorDataAdm(requestRelatorioPedido).subscribe(
      (data: any[]) => {
        this.pedidos = data;
        if (!this.isPrimeiraConsulta) {
          if (this.pedidos.length === 0) {
            this.toastr.warning('Nenhum pedido encontrado', 'Atenção')
          }
        }
        this.isPrimeiraConsulta = false;
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




}
