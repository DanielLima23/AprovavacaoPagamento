import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { CentroDeCustoService } from '../centro-de-custo.service';
import { Usuario } from 'app/models/usuario';
import { AbstractControl, FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-centro-de-custo-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
})
export class CentroDeCustoAdicionarComponent implements OnInit {

  centroCusto: CentroDeCusto = new CentroDeCusto();
  listaResponsaveis: Usuario[] = []
  isSubmitting: boolean = false
  clienteId: number = 0

  constructor(
    private router: Router,
    private centroService: CentroDeCustoService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {

    this.centroCustoForm.markAsUntouched();

    // this.centroCustoForm.valueChanges.subscribe(s => {
    //   console.log(s);
    // });

  }

  customValidation: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const descricao = control.get('descricao');
    const responsavelId = control.get('reponsavel.id');

    if (descricao && responsavelId) {
      if (!descricao.value || !responsavelId.value) {
        return { 'requiredFields': true };
      }
    }
    return null;
  };

  public centroCustoForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    descricao: new UntypedFormControl(undefined, Validators.required),
    reponsavel: new UntypedFormGroup({
      id: new UntypedFormControl(0)
    }),
  }, { validators: this.customValidation });


  ngOnInit() {
    this.preencherListaResponsaveis()
    this.clienteId = this.activatedRoute.snapshot.params['id'];
    if (this.clienteId) {
      this.findCentroById(this.clienteId);
    }
  }


  findCentroById(clienteId: number) {
    this.centroService.getById(clienteId).subscribe(
      (data: CentroDeCusto) => {
        this.centroCustoForm.patchValue(data)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  salvar() {
    if (this.centroCustoForm.value.id <= 0) {
      this.centroService.registerCentroCusto(this.centroCustoForm.getRawValue()).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.centroCustoForm.reset()
        }
      )
    }

    if (this.centroCustoForm.value.id > 0) {
      this.centroService.updateCentroCusto(this.centroCustoForm.value.id, this.centroCustoForm.getRawValue()).subscribe(
        (data: any) => {
          this.toastrService.success('Atualizado com sucesso!', 'Sucesso');
          this.centroCustoForm.reset()
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
