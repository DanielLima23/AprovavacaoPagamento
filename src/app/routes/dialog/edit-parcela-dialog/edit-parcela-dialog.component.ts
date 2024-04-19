import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Parcelas } from 'app/models/parcelas';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-edit-parcela-dialog',
  templateUrl: './edit-parcela-dialog.component.html',
  styleUrls: ['./edit-parcela-dialog.component.scss']
})
export class DialogEditParcelaDialogComponent implements OnInit {

  parcela: Parcelas = new Parcelas()


  constructor(public dialogRef: MatDialogRef<DialogEditParcelaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private datePipe: DatePipe) {
    this.parcela = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    const today = new Date();
    const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dataVencimento = this.datePipe.transform(this.parcela.dataVencimento, 'dd/MM/yyyy');
    const dataPagamento = this.datePipe.transform(this.parcela.dataPagamento, 'dd/MM/yyyy');

    if (dataPagamento) {
      const [day, month, year] = dataPagamento.split('/');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      if (date < formattedDate) {
        this.toastr.warning('A data de pagamento não pode ser anterior à data atual', 'Atenção');
        return;
      }
    }

    if (dataVencimento) {
      const [day, month, year] = dataVencimento.split('/');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      if (date < formattedDate) {
        this.toastr.warning('A data de vencimento não pode ser anterior à data atual', 'Atenção');
        return;
      }
    }

    if (dataPagamento && dataVencimento) {
      if (dataPagamento > dataVencimento) {
        this.toastr.warning('A data de pagamento não pode ser maior que a data de vencimento', 'Atenção');
        return;
      }
    }

    this.dialogRef.close(this.parcela);
  }

  delete() {
    this.dialogRef.close(this.parcela.id);
  }
}
