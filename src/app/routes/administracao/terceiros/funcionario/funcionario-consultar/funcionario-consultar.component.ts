import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Terceiro } from 'app/models/terceiro';
import { DialogEditFornecedorDialogComponent } from 'app/routes/dialog/edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TerceiroService } from '../../terceiro.service';

@Component({
  selector: 'app-administracao-terceiros-funcionario-funcionario-consultar',
  templateUrl: './funcionario-consultar.component.html',
  styleUrls: ['./funcionario-consultar.component.scss']
})
export class AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent implements OnInit {

  constructor(private router: Router,
    private terceiroService: TerceiroService,
    private dialog: MatDialog,
    private toastr: ToastrService
    ) { }


  listaFuncionarios: Terceiro[] = [];



  ngOnInit() {
    this.preencheListaFuncionarios()
  }

  adicionar() {
    this.router.navigate(['administracao/funcionario-adicionar']);
  }

  editarFuncionario(id: any) {
    this.router.navigate(['administracao/funcionario-adicionar', id]);
  }


  excluirFuncionario(id: any) {
    this.terceiroService.deleteTerceiroById(id).subscribe(
      (data: any) => {
        this.preencheListaFuncionarios();
        this.toastr.success('Deletado com sucesso!','Sucesso');
      },
      (error: any) => { }
    );
  }

  preencheListaFuncionarios() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFuncionarios = data.filter( terceiro => terceiro.tipoTerceiro == 0)
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
        this.atualizarFuncionario(result.id, result);
      }
    });
  }

  atualizarFuncionario(id: any, parcela: Terceiro) {

    this.excluirFuncionario(parcela.id)
  }

}
