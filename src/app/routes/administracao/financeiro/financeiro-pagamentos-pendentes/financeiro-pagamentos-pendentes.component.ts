import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestStatusPagamento } from 'app/models/auxiliar/request-status-pagamento';
import { DialogParcelasNaoAprovadasComponent } from 'app/routes/dialog/parcelas-nao-aprovadas/parcelas-nao-aprovadas.component';
import { DialogPedidosPorParcelaFuncionarioComponent } from 'app/routes/dialog/pedidos-por-parcela-funcionario/pedidos-por-parcela-funcionario.component';
import { DialogPedidosPorParcelaComponent } from 'app/routes/dialog/pedidos-por-parcela/pedidos-por-parcela.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { ToastrService, Overlay } from 'ngx-toastr';
interface ParcelaPorDia {
  [key: string]: any[];
}

interface ParcelaPorMes {
  [key: string]: { dia: string, parcelas: any[], isOpen: boolean }[];
}

interface ListaParcelasPorMes {
  mesAno: string;
  dias: { dia: string, parcelas: any[], isOpen: boolean }[];
}

interface PainelState {
  mesAno: string;
  dia: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-administracao-financeiro-financeiro-pagamentos-pendentes',
  templateUrl: './financeiro-pagamentos-pendentes.component.html',
  styleUrls: ['./financeiro-pagamentos-pendentes.component.scss']
})
export class AdministracaoFinanceiroFinanceiroPagamentosPendentesComponent implements OnInit {

  listaParcelasPorMes: ListaParcelasPorMes[] = [];
  panelStates: PainelState[] = [];
  selectedRowIds: Set<number> = new Set<number>();
  selectedParcelaId: number | null = null;
  listaParcelasValidacao: any
  requestStatusPagamento : RequestStatusPagamento[] =[]
  constructor(
    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private overlay: Overlay
  ) { }

  ngOnInit() {
    this.preencheListaParcelasPendentes();
  }

  retornaPedidoPorParcelaId(id: any) {
    // this.pedidoService.getPedidoPorParcelaId(id).subscribe(
    //   (data:any) => {
    //     return data.id
    //   }
    // )
  }

  verPedidoDaParcela(id: any) {
    this.pedidoService.getPedidoPorParcelaId(id).subscribe(
      (data: any) => {
        if(data.formaPagamento[0].terceiro == null){
          if(data.usuario.id == data.usuarioSolicitou.id ){
            this.openDialogPedidoPorParcelaUsuario(data.id)
          }
        }else if(data.formaPagamento[0].terceiro){
          this.openDialogPedidoPorParcelaFuncionario(data.id)
        }
      }
    )
  }

  openDialogPedidoPorParcelaUsuario(id: any): void {
    const dialogRef = this.dialog.open(DialogPedidosPorParcelaComponent, {
      data: id,
      width: '50%',
      maxHeight: '90vh',
      //scrollStrategy: this.overlay.scrollStrategies.reposition(),
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
      //scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  ngAfterViewInit() {
    // Atualiza o estado dos painéis
    this.restorePanelStates();
  }

  preencheListaParcelasPendentes() {
    this.pedidoService.getListParcelasPendentes(2).subscribe(data => {
      const parcelasPorDia: ParcelaPorDia =  {};

      // Agrupando as parcelas por dia
      data.forEach((item: any) => {
        const dataParcela = this.datePipe.transform(item.data, 'yyyy-MM-dd');
        if (!parcelasPorDia[dataParcela!]) {
          parcelasPorDia[dataParcela!] = [];
        }
        parcelasPorDia[dataParcela!].push(item);
      });

      // Agrupando as parcelas por mês e dia
      const parcelasPorMes: ParcelaPorMes = {};
      Object.keys(parcelasPorDia).forEach(dia => {
        const data = new Date(dia);
        const mesAno = `${this.nomeMes(data.getMonth() + 1)} ${data.getFullYear()}`;

        if (!parcelasPorMes[mesAno]) {
          parcelasPorMes[mesAno] = [];
        }

        parcelasPorMes[mesAno].push({ dia: dia, parcelas: parcelasPorDia[dia], isOpen: false });
      });

      // Ordenando os meses
      const mesesOrdenados = Object.keys(parcelasPorMes).sort((a, b) => {
        const [mesA, anoA] = a.split(' ');
        const [mesB, anoB] = b.split(' ');
        return new Date(`${anoA}-${this.mesNumero(mesA)}-01`).getTime() - new Date(`${anoB}-${this.mesNumero(mesB)}-01`).getTime();
      });

      // Salvando a lista de parcelas por mês
      this.listaParcelasPorMes = mesesOrdenados.map(mesAno => {
        return {
          mesAno: mesAno,
          dias: parcelasPorMes[mesAno].map((dia: any) => ({ ...dia })),
        };
      });

      // Ordenando os dias dentro de cada mês
      this.listaParcelasPorMes.forEach(mes => {
        mes.dias.sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
      });

      // Restaurando os estados dos painéis
      this.restorePanelStates();
    });
  }

  nomeMes(mes: number): string {
    const meses: { [key: number]: string } = {
      1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
      7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
    };
    return meses[mes];
  }

  mesNumero(mes: string): string {
    const meses: { [key: string]: string } = {
      'Janeiro': '01', 'Fevereiro': '02', 'Março': '03', 'Abril': '04', 'Maio': '05', 'Junho': '06',
      'Julho': '07', 'Agosto': '08', 'Setembro': '09', 'Outubro': '10', 'Novembro': '11', 'Dezembro': '12'
    };
    return meses[mes];
  }
  parcelasId: number[] = []
  agendarParcela(id: number) {
    this.parcelasId.push(id)
    const parcela = new RequestStatusPagamento()
    parcela.idParcela = id
    parcela.status = 1
    this.requestStatusPagamento.push(parcela)
    this.pedidoService.pagarParcela(this.requestStatusPagamento).subscribe((data: any) => { // Adicione (data: any) =>
      if (data != null && data.length > 0) {
        this.openDialogParcelasNaoAprovadas(data)
      } else {
        this.preencheListaParcelasPendentes();
        this.toastr.success('Parcelas pagas', 'Sucesso');
      }
    });
    this.parcelasId = [];
    this.selectedRowIds.clear();
  }


  savePanelStates() {
    this.panelStates = [];

    this.listaParcelasPorMes.forEach(mes => {
      mes.dias.forEach(dia => {
        const state: PainelState = {
          mesAno: mes.mesAno,
          dia: dia.dia,
          isOpen: dia.isOpen
        };
        this.panelStates.push(state);
      });
    });
  }

  restorePanelStates() {
    this.panelStates.forEach(state => {
      const mes = this.listaParcelasPorMes.find(mes => mes.mesAno === state.mesAno);
      if (mes) {
        const dia = mes.dias.find(dia => dia.dia === state.dia);
        if (dia) {
          dia.isOpen = state.isOpen;
        }
      }
    });
  }

  isMesOpen(mesAno: string): boolean {
    const mes = this.listaParcelasPorMes.find(mes => mes.mesAno === mesAno);
    if (mes && mes.dias) {
      return mes.dias.some(dia => dia.isOpen);
    }
    return false;
  }

  isDiaOpen(mesAno: string, dia: string): boolean {
    const mes = this.listaParcelasPorMes.find(mes => mes.mesAno === mesAno);
    if (mes) {
      const diaState = mes.dias.find(diaItem => diaItem.dia === dia);
      return diaState ? diaState.isOpen : false;
    }
    return false;
  }

  onRowClick(id: number) {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
      this.requestStatusPagamento = this.requestStatusPagamento.filter(parcela => parcela.idParcela !== id);
    }
    else {
      this.selectedRowIds.add(id);
      const parcela = new RequestStatusPagamento()
      parcela.idParcela = id
      parcela.status = 1
      this.requestStatusPagamento.push(parcela)
    }
  }

  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }

  getSelectedRows() {
    return Array.from(this.selectedRowIds);
  }

  onLogClick() {
    console.log(this.getSelectedRows());
  }


  get idsSelecionados(): number[] {
    return this.getSelectedRows()
  }

  aprovarSelecionados() {
    this.pedidoService.pagarParcela(this.requestStatusPagamento).subscribe((data: any) => {
      this.preencheListaParcelasPendentes();
      this.selectedRowIds.clear()
      if (data != null && data.length > 0) {
        this.toastr.warning('Essa parcela contém parcelas anteriores que não estão pagas.','Atenção')

        //this.openDialogParcelasNaoAprovadas(data)
      } else {
        this.toastr.success('Parcelas pagas', 'Sucesso');
      }

    });
  }

  openDialogParcelasNaoAprovadas(data: any): void {
    const dialogRef = this.dialog.open(DialogParcelasNaoAprovadasComponent, {
      data: { data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.preencheListaParcelasPendentes()
        this.toastr.success('Parcelas paga', 'Sucesso');
      }
    });
  }

  clearIdsParcelas() {
    this.selectedRowIds.clear()
    this.parcelasId = []
    this.requestStatusPagamento = []
  }
}
