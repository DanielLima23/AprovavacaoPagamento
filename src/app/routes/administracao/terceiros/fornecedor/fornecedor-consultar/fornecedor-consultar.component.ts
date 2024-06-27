import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Terceiro } from 'app/models/terceiro';
import { TerceiroService } from 'app/routes/administracao/terceiros/terceiro.service';
import { DialogEditFornecedorDialogComponent } from 'app/routes/dialog/edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-terceiros-fornecedor-fornecedor-consultar',
  templateUrl: './fornecedor-consultar.component.html',
  styleUrls: ['./fornecedor-consultar.component.scss']
})
export class AdministracaoTerceirosFornecedorFornecedorConsultarComponent implements OnInit {

  constructor(private router: Router,
    private terceiroService: TerceiroService,
    private dialog: MatDialog,
    private toastr: ToastrService
    ) { }


  listaFornecedores: Terceiro[] = [];



  ngOnInit() {
    this.preencheListaFornecedores()
  }

  adicionar() {
    this.router.navigate(['administracao/fornecedor-adicionar']);
  }

  editarFornecedor(idForncedor: any) {
    this.router.navigate(['administracao/fornecedor-adicionar', idForncedor]);
  }


  excluirFornecedor(fornecedorId: any) {
    this.terceiroService.deleteTerceiroById(fornecedorId).subscribe(
      (data: any) => {
        this.preencheListaFornecedores();
        this.toastr.success('Deletado com sucesso!','Sucesso');
      },
      (error: any) => { }
    );
  }

  preencheListaFornecedores() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFornecedores = data.filter( terceiro => terceiro.tipoTerceiro == 1)
        this.filteredListaFornecedores = data
      }
    )
  }



  nomeFornecedor: string = ""


  openDialogDelete(terceiro: Terceiro): void {
    const dialogRef = this.dialog.open(DialogEditFornecedorDialogComponent, {
      width: '350px',
      data: { ...terceiro },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarFornecedor(result.id, result);
      }
    });
  }

  atualizarFornecedor(id: any, parcela: Terceiro) {

    this.excluirFornecedor(parcela.id)
  }
  _filter:string=""
  filteredListaFornecedores: Terceiro[] = []


  set filter(value: string){
    this._filter = value;
    this.filteredListaFornecedores = this.listaFornecedores.filter((fornecedor: Terceiro)=> fornecedor.nome.toLocaleLowerCase().indexOf(this._filter.toLocaleLowerCase()) > -1)
  }

  get filter(): string{
    return this._filter
  }

}
