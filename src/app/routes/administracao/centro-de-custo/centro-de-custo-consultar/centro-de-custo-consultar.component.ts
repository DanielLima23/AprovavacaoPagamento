import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { DialogEditCentroCustoDialogComponent } from 'app/routes/dialog/edit-centro-custo-dialog/edit-centro-custo-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-centro-de-custo-centro-de-custo-consultar',
  templateUrl: './centro-de-custo-consultar.component.html',
  styleUrls: ['./centro-de-custo-consultar.component.scss']
})
export class AdministracaoCentroDeCustoCentroDeCustoConsultarComponent implements OnInit {

  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];

  centroCusto = new CentroDeCusto();

  listaCentros: CentroDeCusto[] = []
  filteredListaCentros: CentroDeCusto[] = []

  _filter:string=""

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
        this.filteredListaCentros = data;
      }
    )
  }

  editarCentroCusto(idCentro: number) {
    this.router.navigate(['/administracao/centro-de-custo-adicionar', idCentro]);
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
    this.router.navigate(['/administracao/centro-de-custo-adicionar']);
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

  set filter(value: string){
    this._filter = value;
    this.filteredListaCentros = this.listaCentros.filter((centro: CentroDeCusto)=> centro.descricao.toLocaleLowerCase().indexOf(this._filter.toLocaleLowerCase()) > -1)
  }

  get filter(): string{
    return this._filter
  }

  // deletarCentro(id: any) {
  //   const index = this.rateio.findIndex(objeto => objeto.id === id);

  //   if (index !== -1) {
  //     this.rateio.splice(index, 1);
  //     this.dataSourceRateio.data = [...this.rateio];
  //   }
  // }

}
