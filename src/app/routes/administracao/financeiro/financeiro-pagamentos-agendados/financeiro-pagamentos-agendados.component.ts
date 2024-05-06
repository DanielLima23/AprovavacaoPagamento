// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogPedidosAgendadorsFinanceiroComponent } from 'app/routes/dialog/pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';
// import { PedidoService } from 'app/routes/pedido/pedido.service';
// import { ToastrService } from 'ngx-toastr';


// @Component({
//   selector: 'app-administracao-financeiro-financeiro-pagamentos-agendados',
//   templateUrl: './financeiro-pagamentos-agendados.component.html',
//   styleUrls: ['./financeiro-pagamentos-agendados.component.scss']
// })
// export class AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent implements OnInit {
//   panelOpenState = false;
//   listaParcelas: any
//   listaParcelasPorMes:any
//   constructor(private pedidoService: PedidoService,
//     private toastr: ToastrService
//   ) { }

//   ngOnInit() {
//     this.preencheListaParcelasPendentes()
//   }

//   preencheListaParcelasPendentes() {
//     this.pedidoService.getListParcelasPendentes().subscribe(data => {
//       // Agrupando as parcelas por mês
//       const parcelasPorMes: { [key: string]: any[] } = {};
//       data.forEach((parcela: any) => {
//         const dataParcela = new Date(parcela.data);
//         const mes = dataParcela.toLocaleString('default', { month: 'long' });
//         const ano = dataParcela.getFullYear();
//         const chave = `${ano}-${dataParcela.getMonth() + 1}`;

//         if (!parcelasPorMes[chave]) {
//           parcelasPorMes[chave] = [];
//         }
//         parcelasPorMes[chave].push(parcela);
//       });

//       // Ordenando os meses
//       const mesesOrdenados = Object.keys(parcelasPorMes).sort((a, b) => {
//         return new Date(a).getTime() - new Date(b).getTime();
//       });

//       // Salvando a lista ordenada de parcelas
//       this.listaParcelasPorMes = mesesOrdenados.map(chave => {
//         const [ano, mes] = chave.split('-');
//         return {
//           mes: `${this.nomeMes(Number(mes))} ${ano}`,
//           parcelas: parcelasPorMes[chave]
//         };
//       });

//       // Ordenar as parcelas em cada mês
//       this.listaParcelasPorMes.forEach((mes: any) => {
//         mes.parcelas.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());
//       });

//     });
//   }

//   nomeMes(mes: number): string {
//     const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
//       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
//     return meses[mes - 1];
//   }

//   groupBy(list: any[], key: string): any {
//     return list.reduce((acc, item) => {
//       const group = item[key];
//       acc[group] = acc[group] || [];
//       acc[group].push(item);
//       return acc;
//     }, {});
//   }



//   aprovarParcela(id: number) {
//     this.pedidoService.pagarParcela(id).subscribe(data => {
//       this.toastr.success('Parcela paga', 'Sucesso')
//       this.preencheListaParcelasPendentes()
//     })
//     //this.dialogRef.close()
//   }

// }




import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-administracao-financeiro-financeiro-pagamentos-agendados',
  templateUrl: './financeiro-pagamentos-agendados.component.html',
  styleUrls: ['./financeiro-pagamentos-agendados.component.scss']
})
export class AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent implements OnInit {
  listaParcelasPorMes: ListaParcelasPorMes[] = [];
  panelStates: PainelState[] = [];
  selectedRowIds: Set<number> = new Set<number>();
  selectedParcelaId: number | null = null;

  constructor(
    private pedidoService: PedidoService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.preencheListaParcelasPendentes();
  }

  ngAfterViewInit() {
    // Atualiza o estado dos painéis
    this.restorePanelStates();
  }

  preencheListaParcelasPendentes() {
    this.pedidoService.getListParcelasPendentes().subscribe(data => {
      const parcelasPorDia: ParcelaPorDia = {};

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

  aprovarParcela(id: number, multi: boolean) {
    this.pedidoService.pagarParcela(id).subscribe(() => {
      if (!multi) {
        this.preencheListaParcelasPendentes();
        this.toastr.success('Parcela paga', 'Sucesso');
      }
    });

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
    }
    else {
      this.selectedRowIds.add(id);
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
    Promise.all(
      this.idsSelecionados.map((id: any) => {
        return this.aprovarParcela(id, true);
      })
    ).then(() => {
      this.preencheListaParcelasPendentes();
      this.selectedRowIds.clear()
      this.toastr.success('Parcelas paga', 'Sucesso');
    });
  }

  // async aprovarSelecionados() {
  //   for (const id of this.idsSelecionados) {
  //     await this.aprovarParcela(id, true);
  //   }
  //   this.preencheListaParcelasPendentes();
  //   this.selectedRowIds.clear()
  //     this.toastr.success('Parcelas paga', 'Sucesso');
  // }


}
