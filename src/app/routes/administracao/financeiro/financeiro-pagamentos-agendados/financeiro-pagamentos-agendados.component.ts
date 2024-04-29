import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPedidosAgendadorsFinanceiroComponent } from 'app/routes/dialog/pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';

@Component({
  selector: 'app-administracao-financeiro-financeiro-pagamentos-agendados',
  templateUrl: './financeiro-pagamentos-agendados.component.html',
  styleUrls: ['./financeiro-pagamentos-agendados.component.scss']
})
export class AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent implements OnInit {
  selectedDate: any;

  constructor(private datePipe: DatePipe,private dialog: MatDialog) { }

  ngOnInit() {
  }

  dateSelected(event: any) {
    this.selectedDate = event;
    this.openDialog();
  }

  openDialog() {
    const dataFormatada = this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss');
    const dialogRef = this.dialog.open(DialogPedidosAgendadorsFinanceiroComponent, {
      data: { date: dataFormatada }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}
