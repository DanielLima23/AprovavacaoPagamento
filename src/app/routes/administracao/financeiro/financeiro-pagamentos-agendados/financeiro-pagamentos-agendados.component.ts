// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogPedidosAgendadorsFinanceiroComponent } from 'app/routes/dialog/pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';

// @Component({
//   selector: 'app-administracao-financeiro-financeiro-pagamentos-agendados',
//   templateUrl: './financeiro-pagamentos-agendados.component.html',
//   styleUrls: ['./financeiro-pagamentos-agendados.component.scss']
// })
// export class AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent implements OnInit {
//   selectedDate: any;

//   constructor(private datePipe: DatePipe,private dialog: MatDialog) { }

//   ngOnInit() {
//   }

//   dateSelected(event: any) {
//     this.selectedDate = event;
//     this.openDialog();
//   }

//   openDialog() {
//     const dataFormatada = this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss');
//     const dialogRef = this.dialog.open(DialogPedidosAgendadorsFinanceiroComponent, {
//       data: { date: dataFormatada }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//     });
//   }



// }

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DialogPedidosAgendadorsFinanceiroComponent } from 'app/routes/dialog/pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';

@Component({
  selector: 'app-administracao-financeiro-financeiro-pagamentos-agendados',
  templateUrl: './financeiro-pagamentos-agendados.component.html',
  styleUrls: ['./financeiro-pagamentos-agendados.component.scss']
})
export class AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent implements OnInit {
  selectedDate: any;
  datesWithOrder: string[] = [];

  constructor(private datePipe: DatePipe, private dialog: MatDialog) { }

  ngOnInit() {
    this.setDatesWithOrder();
  }

  dateSelected(event: any) {
    this.selectedDate = event;
    this.openDialog();
  }

  openDialog() {
    let dataFormatada: string | null = null;
    if (this.selectedDate) {
      dataFormatada = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    }
    const dialogRef = this.dialog.open(DialogPedidosAgendadorsFinanceiroComponent, {
      data: { date: dataFormatada }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  orders = [
    { date: new Date('2024-05-01') },
    { date: new Date('2024-05-05') },
    { date: new Date('2024-05-10') }
    // Adicione aqui os seus pedidos com as datas correspondentes
  ];

  setDatesWithOrder() {
    this.orders.forEach(order => {
      this.datesWithOrder.push(this.datePipe.transform(order.date, 'yyyy-MM-dd')!);
    });
  }

  dateHasOrder(date: Date): boolean {
    const dataFormatada = this.datePipe.transform(date, 'yyyy-MM-dd')? this.datePipe.transform(date, 'yyyy-MM-dd') : '' ;
    const hasOrder = this.datesWithOrder.includes(dataFormatada? dataFormatada : '');
    console.log('Date: ', dataFormatada, 'Has Order: ', hasOrder);
    return hasOrder;
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const hasOrder = this.dateHasOrder(date);
      return hasOrder ? 'has-order' : '';
    };
  }
}
