import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Terceiro } from 'app/models/terceiro';
import { FornecedorService } from '../fornecedor.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditFornecedorDialogComponent } from 'app/routes/dialog/edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fornecedor-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class FornecedorConsultarComponent implements OnInit {

  displayedColumns: string[] = ['fornecedor', 'finalidade', 'actions'];

  constructor(private router: Router,
    private fornecedorService: FornecedorService,
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
    this.fornecedorService.deleteForncedorById(fornecedorId).subscribe(
      (data: any) => {
        this.preencheListaFornecedores();
        this.toastr.success('Deletado com sucesso!','Sucesso');
      },
      (error: any) => { }
    );
  }

  preencheListaFornecedores() {
    this.fornecedorService.getListaFornecedorPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFornecedores = data;
      }
    )
  }

  onNoClick(): void {
    this.CloseModel()
  }

  onYesClick(): void {
    const modelDiv = document.getElementById('myModal');
    const id = modelDiv?.getAttribute('data-id');
    this.excluirFornecedor(id)
    this.CloseModel()
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  nomeFornecedor: string = ""
  openModal(id: number, nome: string) {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
      modelDiv.setAttribute('data-id', id.toString());
      this.nomeFornecedor = nome
    }
  }


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

    //aqui pode atualizar ou excluir
    this.excluirFornecedor(parcela.id)
  }
}
