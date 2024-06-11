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
  dataVencimentoBackup: string = ""
  valorTotal: number = 0
  constructor(public dialogRef: MatDialogRef<DialogEditParcelaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private datePipe: DatePipe) {
    this.parcela = { ...data };
    this.valorTotal = data.valorTotal
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }
  dataBackup() {
    this.dataVencimentoBackup = this.parcela.dataVencimento
  }
  salvar() {
    const today = new Date();
    const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dataVencimento = this.datePipe.transform(this.parcela.dataVencimento, 'yyyy-MM-dd');
    const dataPagamento = this.datePipe.transform(this.parcela.dataPagamento, 'yyyy-MM-dd');

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
    let valorParcela = 0

    if (typeof this.parcela.valorParcela === 'string') {
      valorParcela = parseFloat(this.parcela.valorParcela.replace(/\./g, '').replace(',', '.'));
    }
    if (valorParcela >= this.valorTotal) {
      this.toastr.warning('O valor da parcela não pode ser maior ou igual que o valor total do pedido.', 'Atenção');
      return
    }


    this.parcela.valorParcela = this.parcela.valorParcela.trim()
    this.dialogRef.close(this.parcela);
  }

  delete() {
    this.dialogRef.close(this.parcela.id);
  }

  mascaraMoeda(event: any): void {
    const onlyDigits: string = event.target.value
      .split("")
      .filter((s: string) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat: string = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    event.target.value = this.maskCurrency(parseFloat(digitsFloat));
    this.parcela.valorParcela = event.target.value.replace('R$', '')
  }

  maskCurrency(valor: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor);
  }

  formatCurrency(value: string): string {
    if (!value) return '';
    const numberValue = parseFloat(value.replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
  }
}
