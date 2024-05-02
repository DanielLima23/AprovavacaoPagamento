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
  listaCentroCusto: CentroDeCusto[] = []

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private centroService: CentroDeCustoService,
    private cdref: ChangeDetectorRef,
  ) { }

  public consultarPedidoForm: UntypedFormGroup = new UntypedFormGroup({
    dataInicio: new UntypedFormControl(undefined),
    dataFim: new UntypedFormControl(undefined),
    statusPagamento: new UntypedFormControl(99),
    centroDeCustoID: new UntypedFormControl(0),
    usuarioID: new UntypedFormControl(0),
    filtraStatusPagamento: new UntypedFormControl(false)
  });

  ngOnInit() {
    this.listaTipoStatusPagamento = TipoStatusPagamento.statusPagamento
    this.getCurrentDate()
    this.preencheListaCentros()
    this.preencheListaUsuarios()
    this.consultarPedidos()

  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  verPedido(id: number) {
    this.idPedido = id
    this.router.navigate(['/pedido/adicionar'], { state: { id: id, relatorio: 'relatorio' } });
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
    requestRelatorioPedido.idUsuario = this.consultarPedidoForm.get('usuarioID')?.value
    requestRelatorioPedido.idCentroDeCusto = this.consultarPedidoForm.get('centroDeCustoID')?.value
    requestRelatorioPedido.filtraStatusPagamento = this.consultarPedidoForm.get('filtraStatusPagamento')?.value
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


  bloquearFiltroCentroCusto() {
    const usuarioId = this.consultarPedidoForm.get('usuarioID')?.value;
    if(usuarioId > 0){
      this.consultarPedidoForm.get('centroDeCustoID')?.disable()
      this.consultarPedidoForm.get('centroDeCustoID')?.setValue(0)

    }else{
      this.consultarPedidoForm.get('centroDeCustoID')?.enable()

    }
  }

}
