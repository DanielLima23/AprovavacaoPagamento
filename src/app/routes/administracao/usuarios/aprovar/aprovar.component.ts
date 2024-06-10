import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaUsuario } from 'app/models/conta-usuario';
import { RequestAprovacaoUsuario } from 'app/models/req-aprovacao-usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { TipoStatusUsuarioSelect } from 'app/util/classes/select-tipo-status-usuario';
import { TipoUsuarioSelect } from 'app/util/classes/select-tipo-usuario';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-administracao-usuarios-aprovar',
  templateUrl: './aprovar.component.html',
  styleUrls: ['./aprovar.component.scss']
})
export class AdministracaoUsuariosAprovarComponent implements OnInit {


  selectedOptions = new FormControl<CentroDeCusto[]>([]);
  listaCentroCusto: CentroDeCusto[] = []
  isSubmitting: boolean = false;
  listaContaUsuario: ContaUsuario[] = []
  listaStatusUsuario: string[] = [];
  listaTipoUsuario: string[] = [];
  idUsuario: number = 0;

  constructor(private centroCustoService: CentroDeCustoService,
    private mapeamentoEnumService: MapeamentoEnumService,
    private cdref: ChangeDetectorRef,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.aprovarUsuarioForm.valueChanges.subscribe(s => {
      console.log(s);
    });
  }

  ngOnInit() {

    this.listaStatusUsuario = TipoStatusUsuarioSelect.tiposStatus.map(status => status.descricao);
    this.listaTipoUsuario = TipoUsuarioSelect.tiposUsuario.map(tipo => tipo.descricao)
    this.idUsuario = this.activatedRoute.snapshot.params['id'];
    this.retornaUsuario()
    this.preencheListaCentros()
    //this.preencheListaCentros()
    this.desabilitarCampos()
    // if(!this.aprovarUsuarioForm.get('idCentroCusto')?.value){
    //   this.aprovarUsuarioForm.get('idCentroCusto')?.setErrors({ centroInvalido: 'Selecione um centro de custo' });

    // }
  }

  desabilitarCampos(){
    this.aprovarUsuarioForm.get('nome')?.disable();
    this.aprovarUsuarioForm.get('email')?.disable();
    this.aprovarUsuarioForm.get('cpf')?.disable();
    this.aprovarUsuarioForm.get('cnpj')?.disable();
    this.aprovarUsuarioForm.get('celular')?.disable();
    this.aprovarUsuarioForm.get('dataNascimento')?.disable();
    this.aprovarUsuarioForm.get('celular')?.disable();
  }

  public aprovarUsuarioForm: UntypedFormGroup = new UntypedFormGroup({
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

  cpfCnpjRequiredValidator(): { [key: string]: boolean } | null {
    const cpfControl = this.aprovarUsuarioForm.get('cpf');
    const cnpjControl = this.aprovarUsuarioForm.get('cnpj');

    if (!cpfControl || !cnpjControl) {
      return null;
    }
    const cpf = cpfControl.value;
    const cnpj = cnpjControl.value;

    if (cpf || cnpj) {
      return null;
    }
    return { 'cpfCnpjRequired': true };
  }

  limparCpfCnpj() {
    this.aprovarUsuarioForm.get('cpf')?.setValue('')
    this.aprovarUsuarioForm.get('cnpj')?.setValue('')
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.aprovarUsuarioForm.value.tipoCnpj = event.checked;
    this.cdref.detectChanges();

    this.limparCpfCnpj();
  }

  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  setTipoStatus() {
    this.aprovarUsuarioForm.get('tipoStatus')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorDescricao(this.aprovarUsuarioForm.get('tipoStatusDTO')?.value));
  }

  setTipoUsuario() {
    this.aprovarUsuarioForm.get('tipoUsuario')?.setValue(this.mapeamentoEnumService.mapearTipoUsuarioPorDescricao(this.aprovarUsuarioForm.get('tipoUsuarioDTO')?.value));
  }

  retornaUsuario() {
    this.usuarioService.getById(this.idUsuario).pipe(
      switchMap((data: any) => {
        const formatador = new FormatadorData();
        this.aprovarUsuarioForm.patchValue(data);
        this.aprovarUsuarioForm.get('dataNascimento')?.setValue(formatador.formatarData(data.dataNascimento));
        this.aprovarUsuarioForm.get('tipoStatusDTO')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorId(data.tipoStatus));

        return this.usuarioService.getUsuarioClienteById(data.id);
      })
    ).subscribe(
      (data: any) => {
        this.aprovarUsuarioForm.get('tipoStatus')?.setValue(1);
        this.aprovarUsuarioForm.get('tipoStatusDTO')?.setValue(this.mapeamentoEnumService.mapearTipoStatusUsuarioPorId(1));

        this.aprovarUsuarioForm.get('tipoUsuario')?.setValue(data.tipo);
        this.aprovarUsuarioForm.get('tipoUsuarioDTO')?.setValue(this.mapeamentoEnumService.mapearTipoUsuarioPorId(data.tipo));

        this.setTipoStatus();
      },
      (error: any) => {
        console.error('Erro ao retornar usuário:', error);
      }
    );
  }



  openDialogEditar(conta: ContaUsuario) {
  }
  adicionar() {
  }
  aprovar() {
    const request = new RequestAprovacaoUsuario()
    request.idUsuario = this.aprovarUsuarioForm.get('id')?.value
    request.idCentroDeCusto = this.aprovarUsuarioForm.get('idCentroCusto')?.value
    request.statusUsuario = this.aprovarUsuarioForm.get('tipoStatus')?.value
    request.tipoUsuario = this.aprovarUsuarioForm.get('tipoUsuario')?.value
    this.usuarioService.aprovarUsuario(request).subscribe(
      (data: any) => {
        if(data != null || data != undefined){
          this.toastr.success('Usuário aprovado com sucesso', 'Sucesso')
          this.aprovarUsuarioForm.reset()
          this.router.navigate(['/administracao/pendentes-aprovacao']);
        }
        else{
          this.toastr.error('Já existe um usuário com esse tipo de perfil','Erro')
        }

      }
    )
  }
  voltar() {
    this.router.navigate(['/administracao/pendentes-aprovacao']);
  }




}
