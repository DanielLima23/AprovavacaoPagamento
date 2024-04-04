import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { CentroDeCustoService } from '../centro-de-custo.service';
import { Usuario } from 'app/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-centro-de-custo-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
})
export class CentroDeCustoAdicionarComponent implements OnInit {

  centroCusto: CentroDeCusto = new CentroDeCusto();
  listaResponsaveis: Usuario[] = []
  userForm: FormGroup;
  isSubmitting: boolean = false
  clienteId: number = 0


  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private centroService: CentroDeCustoService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userForm = this.formBuilder.group({
      descricao: ['', Validators.required],
      responsavel: ['', Validators.required]

    });
  }

  ngOnInit() {
    this.preencherListaResponsaveis()
    this.clienteId = this.activatedRoute.snapshot.params['id'];
    if (this.clienteId) {
      this.findCategoriaById(this.clienteId);
    }

  }

  findCategoriaById(clienteId: number) {
    this.centroService.getById(clienteId).subscribe(
      (data: CentroDeCusto) => {
        this.centroCusto = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      const userData: any = this.userForm.value;
      console.log(userData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 3000);
    }
  }
  salvar() {
    if (this.centroCusto.id <= 0) {
      this.centroService.registerCentroCusto(this.centroCusto).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.centroCusto = new CentroDeCusto()
        }
      )
    } else {
      this.centroService.updateCentroCusto(this.centroCusto.id,this.centroCusto).subscribe(
        (data: any) => {
          this.toastrService.success('Atualizado com sucesso!', 'Sucesso');
          this.centroCusto = data
        }
      )
    }

  }

  voltar() {
    this.router.navigate(['/centro-de-custo/consultar']);
  }

  preencherListaResponsaveis() {
    this.centroService.getListaResponsaveis().subscribe(
      (data: Usuario[]) => {
        this.listaResponsaveis = data
      }
    )
  }
}