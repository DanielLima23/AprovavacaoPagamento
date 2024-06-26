import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-centro-de-custo-centro-de-custo-adicionar',
  templateUrl: './centro-de-custo-adicionar.component.html',
  styleUrls: ['./centro-de-custo-adicionar.component.scss']
})
export class AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent implements OnInit {

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

    this.centroCustoForm.valueChanges.subscribe(s => {
      console.log(s);
    });

  }

  customValidation: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const descricao = control.get('descricao');
    const responsavelId = control.get('reponsavel.id');
    const responsavelAprovacao = control.get('reponsavelAprovacao');

    if (descricao && responsavelId) {
      if ((!descricao.value || !responsavelId.value) && responsavelAprovacao?.value) {
        return { 'requiredFields': true };
      }
    }
    return null;
  };

  toogleChange(event: MatSlideToggleChange) {

    if (event.checked) {
      this.centroCustoForm.get('reponsavel.id')?.invalid
      this.centroCustoForm.get('reponsavel')?.enable()
    } else {
      this.centroCustoForm.get('reponsavel.id')?.valid
      this.centroCustoForm.get('reponsavel')?.disable()
      this.centroCustoForm.get('reponsavel.id')?.setValue(0)
    }


  }

  public centroCustoForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    descricao: new UntypedFormControl(undefined, Validators.required),
    reponsavel: new UntypedFormGroup({
      id: new UntypedFormControl(0)
    }),
    reponsavelAprovacao: new UntypedFormControl(true)
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
        if (!this.centroCustoForm.get('reponsavelAprovacao')?.value){
          this.centroCustoForm.get('reponsavel')?.disable()
        }
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
          this.router.navigate(['/administracao/centro-de-custo-consultar']);

        }
      )
    }

    if (this.centroCustoForm.value.id > 0) {
      this.centroService.updateCentroCusto(this.centroCustoForm.value.id, this.centroCustoForm.getRawValue()).subscribe(
        (data: any) => {
          this.toastrService.success('Atualizado com sucesso!', 'Sucesso');
          this.centroCustoForm.reset()
          this.router.navigate(['/administracao/centro-de-custo-consultar']);

        }
      )
    }
  }

  voltar() {
    this.router.navigate(['/administracao/centro-de-custo-consultar']);
  }

  preencherListaResponsaveis() {
    this.centroService.getListaResponsaveis().subscribe(
      (data: Usuario[]) => {
        this.listaResponsaveis = data
      }
    )
  }

}
