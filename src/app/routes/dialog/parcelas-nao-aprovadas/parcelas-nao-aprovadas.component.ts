// import { DatePipe } from '@angular/common';
// import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { PedidoService } from 'app/routes/pedido/pedido.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-dialog-parcelas-nao-aprovadas',
//   templateUrl: './parcelas-nao-aprovadas.component.html',
//   styleUrls: ['./parcelas-nao-aprovadas.component.scss']
// })
// export class DialogParcelasNaoAprovadasComponent implements OnInit {

//   selectedRowIds: Set<number> = new Set<number>();
//   parcelasId: number[] = []

//   parcelasNaoAprovadas: any
//   constructor(private router: Router,
//     private datePipe: DatePipe,
//     private toastr: ToastrService,
//     private pedidoService: PedidoService,
//     public dialogRef: MatDialogRef<DialogParcelasNaoAprovadasComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private dialog: MatDialog
//   ) {
//     this.parcelasNaoAprovadas = data
//   }

//   ngOnInit() {
//     console.log(this.parcelasNaoAprovadas)
//   }

//   onRowClick(id: number) {
//     if (this.selectedRowIds.has(id)) {
//       this.selectedRowIds.delete(id);
//     }
//     else {
//       this.selectedRowIds.add(id);
//     }
//   }

//   isPreviousParcelaSelected(id: number, idParcela: number): boolean {
//     const index = this.getSelectedIndex(idParcela);
//     const selectedRows = this.getSelectedRows();
//     if (index === -1 || index === 0) return true;
//     for (let i = 0; i < index; i++) {
//       if (!selectedRows.includes(this.parcelasNaoAprovadas.data[index].parcelasAtrasadas[i].id)) return false;
//     }
//     return true;
//   }

//   getSelectedIndex(idParcela: number): number {
//     return this.parcelasNaoAprovadas.data.findIndex((parcela:any) => parcela.idParcela === idParcela);
//   }


//   rowIsSelected(id: number) {
//     return this.selectedRowIds.has(id);
//   }

//   getSelectedRows() {
//     return Array.from(this.selectedRowIds);
//   }

//   get idsSelecionados(): number[] {
//     return this.getSelectedRows()
//   }

//   pagarParcela(id: number) {
//     this.parcelasId.push(id)
//     this.pedidoService.pagarParcela(this.parcelasId).subscribe((data: any) => { // Adicione (data: any) =>
//       if (data != null && data.length > 0) {
//         this.openDialogParcelasNaoAprovadas(data)
//       } else {
//         this.dialogRef.close(true);

//       }
//     });
//     this.parcelasId = [];
//     this.selectedRowIds.clear();
//   }

//   openDialogParcelasNaoAprovadas(data: any): void {
//     const dialogRef = this.dialog.open(DialogParcelasNaoAprovadasComponent, {
//       data: { data },
//     });

//     dialogRef.afterClosed().subscribe((result: any) => {
//       if (result) {
//         //this.atualizarCentroCusto(result.id, result);
//       }
//     });
//   }

//   aprovarSelecionados() {
//     this.pedidoService.pagarParcela(this.idsSelecionados).subscribe((data: any) => {
//       this.selectedRowIds.clear()
//       if (data != null && data.length > 0) {
//         this.openDialogParcelasNaoAprovadas(data)
//       } else {
//         this.dialogRef.close(true);

//       }

//     });
//   }

// }



// import { DatePipe } from '@angular/common';
// import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { PedidoService } from 'app/routes/pedido/pedido.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-dialog-parcelas-nao-aprovadas',
//   templateUrl: './parcelas-nao-aprovadas.component.html',
//   styleUrls: ['./parcelas-nao-aprovadas.component.scss']
// })
// export class DialogParcelasNaoAprovadasComponent implements OnInit {

//   selectedRowIds: Set<number> = new Set<number>();
//   parcelasId: number[] = []

//   parcelasNaoAprovadas: any
//   constructor(private router: Router,
//     private datePipe: DatePipe,
//     private toastr: ToastrService,
//     private pedidoService: PedidoService,
//     public dialogRef: MatDialogRef<DialogParcelasNaoAprovadasComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private dialog: MatDialog
//   ) {
//     this.parcelasNaoAprovadas = data
//   }

//   ngOnInit() {
//     console.log(this.parcelasNaoAprovadas)
//   }

//   onRowClick(id: number, idParcela: number) {
//     if (this.selectedRowIds.has(id)) {
//       this.selectedRowIds.delete(id);
//     }
//     else {
//       // Verificar se todas as parcelas anteriores estão selecionadas
//       const parcelasAtrasadas = this.parcelasNaoAprovadas.data.find((parcela: any) => parcela.idParcela === idParcela).parcelasAtrasadas;
//       const index = parcelasAtrasadas.findIndex((parcela: any) => parcela.id === id);
//       if (index === 0 || parcelasAtrasadas.slice(0, index).every((parcela: any) => this.selectedRowIds.has(parcela.id))) {
//         this.selectedRowIds.add(id);
//       }else{
//         this.toastr.warning('Selecione as parcelas pendentes anteriores a essa primeiro.','Atenção')
//       }
//     }
//   }

//   isPreviousParcelaSelected(id: number, idParcela: number): boolean {
//     const index = this.getSelectedIndex(idParcela);
//     const selectedRows = this.getSelectedRows();
//     if (index === -1 || index === 0) return true;
//     for (let i = 0; i < index; i++) {
//       if (!selectedRows.includes(this.parcelasNaoAprovadas.data[index].parcelasAtrasadas[i].id)) return false;
//     }
//     return true;
//   }

//   getSelectedIndex(idParcela: number): number {
//     return this.parcelasNaoAprovadas.data.findIndex((parcela:any) => parcela.idParcela === idParcela);
//   }


//   rowIsSelected(id: number) {
//     return this.selectedRowIds.has(id);
//   }

//   getSelectedRows() {
//     return Array.from(this.selectedRowIds);
//   }

//   get idsSelecionados(): number[] {
//     return this.getSelectedRows()
//   }

//   pagarParcela(id: number) {
//     this.parcelasId.push(id)
//     this.pedidoService.pagarParcela(this.parcelasId).subscribe((data: any) => { // Adicione (data: any) =>
//       if (data != null && data.length > 0) {
//         this.openDialogParcelasNaoAprovadas(data)
//       } else {
//         this.dialogRef.close(true);

//       }
//     });
//     this.parcelasId = [];
//     this.selectedRowIds.clear();
//   }

//   openDialogParcelasNaoAprovadas(data: any): void {
//     const dialogRef = this.dialog.open(DialogParcelasNaoAprovadasComponent, {
//       data: { data },
//     });

//     dialogRef.afterClosed().subscribe((result: any) => {
//       if (result) {
//         //this.atualizarCentroCusto(result.id, result);
//       }
//     });
//   }

//   aprovarSelecionados() {
//     this.pedidoService.pagarParcela(this.idsSelecionados).subscribe((data: any) => {
//       this.selectedRowIds.clear()
//       if (data != null && data.length > 0) {
//         this.openDialogParcelasNaoAprovadas(data)
//       } else {
//         this.dialogRef.close(true);

//       }

//     });
//   }

// }





















import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-parcelas-nao-aprovadas',
  templateUrl: './parcelas-nao-aprovadas.component.html',
  styleUrls: ['./parcelas-nao-aprovadas.component.scss']
})
export class DialogParcelasNaoAprovadasComponent implements OnInit {

  selectedRowIds: Set<number> = new Set<number>();
  parcelasId: number[] = []

  parcelasNaoAprovadas: any
  constructor(private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    public dialogRef: MatDialogRef<DialogParcelasNaoAprovadasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.parcelasNaoAprovadas = data
  }

  ngOnInit() {
    console.log(this.parcelasNaoAprovadas)
  }

  onRowClick(id: number, idParcela: number) {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
      this.deselectFollowingParcelas(id, idParcela);
    }
    else {
      // Verificar se todas as parcelas anteriores estão selecionadas
      const parcelasAtrasadas = this.parcelasNaoAprovadas.data.find((parcela: any) => parcela.idParcela === idParcela).parcelasAtrasadas;
      const index = parcelasAtrasadas.findIndex((parcela: any) => parcela.id === id);
      if (index === 0 || parcelasAtrasadas.slice(0, index).every((parcela: any) => this.selectedRowIds.has(parcela.id))) {
        this.selectedRowIds.add(id);
      } else {
        this.toastr.warning('Selecione as parcelas pendentes anteriores a essa primeiro.', 'Atenção');
      }
    }
  }

  deselectFollowingParcelas(id: number, idParcela: number) {
    const parcelasAtrasadas = this.parcelasNaoAprovadas.data.find((parcela: any) => parcela.idParcela === idParcela).parcelasAtrasadas;
    const index = parcelasAtrasadas.findIndex((parcela: any) => parcela.id === id);
    if (index !== -1) {
      for (let i = index + 1; i < parcelasAtrasadas.length; i++) {
        if (this.selectedRowIds.has(parcelasAtrasadas[i].id)) {
          this.selectedRowIds.delete(parcelasAtrasadas[i].id);
        }
      }
    }
  }

  isPreviousParcelaSelected(id: number, idParcela: number): boolean {
    const index = this.getSelectedIndex(idParcela);
    const selectedRows = this.getSelectedRows();
    if (index === -1 || index === 0) return true;
    for (let i = 0; i < index; i++) {
      if (!selectedRows.includes(this.parcelasNaoAprovadas.data[index].parcelasAtrasadas[i].id)) return false;
    }
    return true;
  }

  getSelectedIndex(idParcela: number): number {
    return this.parcelasNaoAprovadas.data.findIndex((parcela: any) => parcela.idParcela === idParcela);
  }

  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }

  getSelectedRows() {
    return Array.from(this.selectedRowIds);
  }

  get idsSelecionados(): number[] {
    return this.getSelectedRows()
  }

  pagarParcela(id: number) {
    this.parcelasId.push(id)
    this.pedidoService.pagarParcela(this.parcelasId).subscribe((data: any) => { // Adicione (data: any) =>
      if (data != null && data.length > 0) {
        this.openDialogParcelasNaoAprovadas(data)
      } else {
        this.dialogRef.close(true);

      }
    });
    this.parcelasId = [];
    this.selectedRowIds.clear();
  }

  openDialogParcelasNaoAprovadas(data: any): void {
    const dialogRef = this.dialog.open(DialogParcelasNaoAprovadasComponent, {
      data: { data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        //this.atualizarCentroCusto(result.id, result);
      }
    });
  }

  aprovarSelecionados() {
    this.pedidoService.pagarParcela(this.idsSelecionados).subscribe((data: any) => {
      this.selectedRowIds.clear()
      if (data != null && data.length > 0) {
        this.openDialogParcelasNaoAprovadas(data)
      } else {
        this.dialogRef.close(true);

      }

    });
  }

}
