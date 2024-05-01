import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { DisableControlDirective } from '@shared/directives/disable-control.directive';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaUsuario } from 'app/models/conta-usuario';
import { RequestAprovacaoUsuario } from 'app/models/req-aprovacao-usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { TipoStatusUsuarioSelect } from 'app/util/classes/select-tipo-status-usuario';
import { TipoUsuarioSelect } from 'app/util/classes/select-tipo-usuario';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-administracao-usuarios-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class AdministracaoUsuariosEditarComponent implements OnInit {
  voltar() {
    this.router.navigate(['/administracao/lista']);
  }


  listaCentroCusto: CentroDeCusto[] = []
  isSubmitting: boolean = false;
  listaContaUsuario: ContaUsuario[] = []
  listaStatusUsuario: string[] = [];
  listaTipoUsuario: string[] = [];
  idUsuario: number = 0;


  constructor(private cdref: ChangeDetectorRef,
    private mapeamentoEnumService: MapeamentoEnumService,
    private centroCustoService: CentroDeCustoService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private contaService: ContaBancariaService
  ) {
    this.usuarioForm.valueChanges.subscribe(s => {
      console.log(s);
    });
  }

  ngOnInit() {
    this.listaStatusUsuario = TipoStatusUsuarioSelect.tiposStatus.map(status => status.descricao);
    this.listaTipoUsuario = TipoUsuarioSelect.tiposUsuario.map(tipo => tipo.descricao)
    this.idUsuario = this.activatedRoute.snapshot.params['id'];
    this.retornaUsuario()
    this.preencheListaCentros()
    this.desabilitarCampos()
    this.preencheListaContasUsuario()
  }

  preencheListaContasUsuario() {
    this.contaService.getListContasPorIdUsuario(this.idUsuario).subscribe(
      (data: ContaUsuario[]) => {
        this.listaContaUsuario = data;
      }
    )
  }


  desabilitarCampos() {
    this.usuarioForm.get('nome')?.disable();
    this.usuarioForm.get('email')?.disable();
    this.usuarioForm.get('cpf')?.disable();
    this.usuarioForm.get('cnpj')?.disable();
    this.usuarioForm.get('celular')?.disable();
    this.usuarioForm.get('dataNascimento')?.disable();
    this.usuarioForm.get('celular')?.disable();

  }

  public usuarioForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    nome: new UntypedFormControl(undefined, Validators.required),
    email: new UntypedFormControl(undefined, Validators.compose([Validators.required, Validators.email])),
    cpf: new UntypedFormControl(undefined),
    cnpj: new UntypedFormControl(undefined),
    celular: new UntypedFormControl(undefined, Validators.required),
    senha: new UntypedFormControl(undefined, Validators.required),
    dataNascimento: new UntypedFormControl(undefined, Validators.required),
    idCentroCusto: new UntypedFormControl(undefined, Validators.compose([Validators.required, this.idCentroCustoValidator()])),
    contaPadrao: new UntypedFormControl(false),
    tipoStatus: new UntypedFormControl(undefined),
    tipoStatusDTO: new UntypedFormControl(undefined, Validators.required),
    tipoCnpj: new UntypedFormControl(false),
    tipoUsuario: new UntypedFormControl(undefined),
    tipoUsuarioDTO: new UntypedFormControl(undefined, Validators.required),
  })

  idCentroCustoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const idCentroCusto = control.value;
      if (idCentroCusto !== null && idCentroCusto <= 0) {
        return { 'idCentroCustoInvalido': true };
      }
      return null;
    };
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.usuarioForm.value.tipoCnpj = event.checked;
    this.cdref.detectChanges();

    this.limparCpfCnpj();
  }


  limparCpfCnpj() {
    this.usuarioForm.get('cpf')?.setValue('')
    this.usuarioForm.get('cnpj')?.setValue('')
  }

  openDialogDelete(conta: ContaUsuario) {
  }
  openDialogEditar(conta: ContaUsuario) {
  }
  adicionar() {
  }
  salvar() {
    // this.isSubmitting = true;
    // this.usuarioService.update(this.usuarioForm.getRawValue()).subscribe(
    //   (data: any) => {
    //     this.toastr.success("Usuário atualizado com sucesso","Sucesso");
    //   }
    // )
    // this.isSubmitting = false;

    const request = new RequestAprovacaoUsuario()
    request.idUsuario = this.usuarioForm.get('id')?.value
    request.idCentroDeCusto = this.usuarioForm.get('idCentroCusto')?.value
    request.statusUsuario = this.usuarioForm.get('tipoStatus')?.value
    request.tipoUsuario = this.usuarioForm.get('tipoUsuario')?.value
    this.usuarioService.aprovarUsuario(request).subscribe(
      (data: any) => {
        if(data != null || data != undefined){
          this.toastr.success('Usuário atualizado com sucesso', 'Sucesso')
          this.router.navigate(['/administracao/editar', this.idUsuario]);
          this.preencheListaContasUsuario()
        }
        else{
          this.toastr.error('Já existe um usuário com esse tipo de perfil','Erro')
        }
      }
    )
  }

  setTipoStatus() {
    this.usuarioForm.get('tipoStatus')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorDescricao(this.usuarioForm.get('tipoStatusDTO')?.value));
  }

  setTipoUsuario() {
    this.usuarioForm.get('tipoUsuario')?.setValue(this.mapeamentoEnumService.mapearTipoUsuarioPorDescricao(this.usuarioForm.get('tipoUsuarioDTO')?.value));
  }

  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  retornaUsuario() {
    this.usuarioService.getById(this.idUsuario).pipe(
      switchMap((data: any) => {
        const formatador = new FormatadorData();
        this.usuarioForm.patchValue(data);
        this.usuarioForm.get('dataNascimento')?.setValue(formatador.formatarData(data.dataNascimento));
        this.usuarioForm.get('tipoStatusDTO')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorId(data.tipoStatus));
        return this.usuarioService.getUsuarioClienteById(data.id);
      })
    ).subscribe(
      (data: any) => {
        this.usuarioForm.get('tipoStatus')?.setValue(data.stauts);
        this.usuarioForm.get('tipoStatusDTO')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorId(data.status));

        this.usuarioForm.get('tipoUsuario')?.setValue(data.tipo);
        this.usuarioForm.get('tipoUsuarioDTO')?.setValue(this.mapeamentoEnumService.mapearTipoUsuarioPorId(data.tipo));

        this.setTipoStatus();
      },
      (error: any) => {
        console.error('Erro ao retornar usuário:', error);
      }
    );
  }

}
