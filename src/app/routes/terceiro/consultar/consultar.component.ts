import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Terceiro } from 'app/models/terceiro';
import { DialogEditFornecedorDialogComponent } from 'app/routes/dialog/edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TerceiroService } from '../terceiro.service';

@Component({
  selector: 'app-terceiro-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class TerceiroConsultarComponent implements OnInit {

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
    this.router.navigate(['/fornecedor/adicionar']);
  }

  editarFornecedor(idForncedor: any) {
    this.router.navigate(['/fornecedor/adicionar', idForncedor]);
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
        this.listaFornecedores = data;
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
}
