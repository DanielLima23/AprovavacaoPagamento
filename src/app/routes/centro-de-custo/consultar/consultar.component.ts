import { Component, OnInit } from '@angular/core';
import { CentroDeCustoService } from '../centro-de-custo.service';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Router } from '@angular/router';
import { DialogEditCentroCustoDialogComponent } from 'app/routes/dialog/edit-centro-custo-dialog/edit-centro-custo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-centro-de-custo-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss'],
})
export class CentroDeCustoConsultarComponent implements OnInit {
  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];

  centroCusto = new CentroDeCusto();

  listaCentros: CentroDeCusto[] = []

  constructor(
    private centroCustoService: CentroDeCustoService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.preencheListaCentros();
  }

  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentros = data;
        console.log(this.listaCentros)
      }
    )
  }

  editarCentroCusto(idCentro: number) {
    this.router.navigate(['/centro-de-custo/adicionar', idCentro]);
  }

  excluirCentroCusto(idCentro: number) {
    this.centroCustoService.deleteById(idCentro).subscribe(
      (data: any) => {
        this.preencheListaCentros();
        this.toastr.success('Deletado com sucesso', 'Sucesso')
      },
      (error: any) => { }
    );

  }

  adicionar() {
    this.router.navigate(['/centro-de-custo/adicionar']);
  }

  openDialogDelete(parcela: CentroDeCusto): void {
    const dialogRef = this.dialog.open(DialogEditCentroCustoDialogComponent, {
      width: '350px',
      data: { ...parcela },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarCentroCusto(result.id, result);
      }
    });
  }

  atualizarCentroCusto(id: any, parcela: CentroDeCusto) {

    this.excluirCentroCusto(parcela.id)
  }

  // deletarCentro(id: any) {
  //   const index = this.rateio.findIndex(objeto => objeto.id === id);

  //   if (index !== -1) {
  //     this.rateio.splice(index, 1);
  //     this.dataSourceRateio.data = [...this.rateio];
  //   }
  // }
}
