import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { DialogEditContaUsuarioDialogComponent } from 'app/routes/dialog/edit-conta-usuario-dialog/edit-conta-usuario-dialog.component';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class UsuarioEditarComponent implements OnInit {

  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'contaPadrao', 'actions'];

  usuario: Usuario = new Usuario();
  listaBancos: string[] = ["Banco do Brasil", "Bradesco", "Itau"];
  isSubmitting = false;
  // userForm: FormGroup;
  contaCnpj: boolean = false;
  token: any = "";
  senhaHabilitada: boolean = true;
  listaContaUsuario: ContaUsuario[] = []
  idConta: number = 0
  listaFormaPagamento: string[] = []
  trackByFn!: TrackByFunction<CentroDeCusto>;
  selectedCentroCustoIds: number[] = [];


  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private toastrService: ToastrService,
    private contaService: ContaBancariaService,
    private activatedRoute: ActivatedRoute,
    private contaUsuarioService: ContaBancariaService,
    private centroCustoService: CentroDeCustoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.userForm.setValidators(this.cpfCnpjRequiredValidator());

    // this.userForm = this.formBuilder.group({
    //   nome: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   cpf: [''],
    //   cnpj: [''],
    //   celular: ['', Validators.required],
    //   senha: [''],
    //   dataNascimento: ['', Validators.required, this.idCentroCustoValidator()],
    //   centroCusto: ['', Validators.required],
    //   contaPadrao: [false],

    // }, {
    //   validators: this.cpfCnpjRequiredValidator
    // });
  }

  public userForm: UntypedFormGroup = new UntypedFormGroup({
    nome: new UntypedFormControl(0),
    email: new UntypedFormControl(undefined, Validators.compose([Validators.required, Validators.email])),
    cpf: new UntypedFormControl(undefined),
    cnpj: new UntypedFormControl(undefined),
    celular: new UntypedFormControl(undefined),
    dataNascimento: new UntypedFormControl(undefined, Validators.required),
    centroCusto: new UntypedFormControl(undefined, Validators.required),
    contaPadrao: new UntypedFormControl(false),
    ausente: new UntypedFormControl(false),

  });

  isEditaAusencia: boolean = false

  cpfCnpjRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cpfControl = this.userForm.get('cpf');
      const cnpjControl = this.userForm.get('cnpj');

      if (!cpfControl || !cnpjControl) {
        return null;
      }

      const cpf = cpfControl.value;
      const cnpj = cnpjControl.value;

      if (cpf || cnpj) {
        return null; // Retorna null se pelo menos um dos campos estiver preenchido
      }

      return { 'cpfCnpjRequired': true }; // Retorna um erro se ambos os campos estiverem vazios
    };
  }


  idCentroCustoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const idCentroCusto = control.value;
      if (idCentroCusto !== null && idCentroCusto <= 0) {
        return { 'centroCusto': true };
      }
      return null;
    };
  }


  ngOnInit() {
    this.retornaUsuario()
    this.preencheListaContasUsuario()
    this.preencheListaCentros()
    this.userForm.get('centroCusto')?.disable()
  }


  preencheListaContasUsuario() {
    this.contaService.getListContasPorTokenUsuario().subscribe(
      (data: ContaUsuario[]) => {
        this.listaContaUsuario = data;
      }
    )
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      const userData: Usuario = this.userForm.value;
      console.log(userData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 3000);
    }
  }

  adicionar() {
    this.router.navigate(['/usuario/conta', this.usuario.id]);
  }

  editarContaBanco(id: number) {
    this.router.navigate(['/usuario/conta', this.usuario.id, id]);

  }
  excluirContaBanco(id: any) {
    this.contaUsuarioService.deleteContaUsuarioById(id).subscribe(
      (data: any) => {
        this.toastrService.success('Excluido com sucesso!', 'Sucesso');
        this.preencheListaContasUsuario()
      }
    )

  }

  limparCpfCnpj() {
    this.usuario.cpf = "";
    this.usuario.cnpj = "";
    this.userForm.markAllAsTouched()
  }



  // retornaUsuario() {
  //   this.usuarioService.getByToken().subscribe(
  //     (data: Usuario) => {
  //       this.usuario = data;
  //       const formatador = new FormatadorData();
  //       this.usuario.dataNascimento = formatador.formatarData(this.usuario.dataNascimento);
  //       this.userForm.get('centroCusto')?.setValue(this.usuario.idCentroCusto)
  //       this.initScreen()
  //     },
  //     (error: any) => {
  //     }
  //   )
  // }

  retornaUsuario() {
    this.usuarioService.getByToken().pipe(
      switchMap((data: any) => {
        this.usuario = data;
        const formatador = new FormatadorData();
        this.usuario.dataNascimento = formatador.formatarData(this.usuario.dataNascimento);
        this.userForm.get('centroCusto')?.setValue(this.usuario.idCentroCusto)
        this.initScreen()
        return this.usuarioService.getUsuarioClienteById(data.id)
      })
    ).subscribe(
      (data:any) => {
        this.userForm.get('ausente')?.setValue(data.ausente)
        this.ausente = data.ausente;
        this.isEditaAusencia = (data.tipo == 3 || data.tipo == 4) ? true : false
      }
    )
  }
  ausente: boolean = false;

 atualizarAusencia(ausente: boolean) {
  this.usuarioService.atualizarAusencia(ausente).subscribe(
    (data: any) => {
      this.toastrService.success('Status atualizado com sucesso!', 'Sucesso');
      this.ausente = data.ausente;
    },
    (error: any) => {
      this.toastrService.error('Erro ao atualizar status de ausência', 'Erro');
      console.error('Erro ao atualizar status de ausência:', error);
    }
  );
}

  initScreen() {
    if (this.usuario != null) {
      if (this.usuario.cnpj != '') {
        this.contaCnpj = true;


      }
      else {
        this.contaCnpj = false
      }
    }
  }

  salvar() {
    this.isSubmitting = true;
    this.usuarioService.update(this.usuario).subscribe(
      (data: Usuario) => {
        this.toastrService.success("Usuário atualizado com sucesso", "Sucesso");
      }
    )
    this.isSubmitting = false;
  }

  selectedOptions = new FormControl<CentroDeCusto[]>([]);

  listaCentroCusto: CentroDeCusto[] = []

  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  onCentroCustoSelectionChange(event: MatSelectChange): void {
    this.selectedCentroCustoIds = event.value;
  }

  onContaPadraoChange(event: any, conta: ContaUsuario): void {
    conta.contaPadrao = event;
    this.contaService.updateContaUsuario(conta.id, conta).subscribe(
      (data: any) => {
        this.toastrService.success("Conta padrão atualizada com sucesso", 'Sucesso');
        this.preencheListaContasUsuario()
      }
    )
  }

  openDialogDelete(conta: ContaUsuario): void {
    const dialogRef = this.dialog.open(DialogEditContaUsuarioDialogComponent, {
      width: '350px',
      data: { ...conta },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarConta(result.id, result);
      }
    });
  }

  atualizarConta(id: any, conta: ContaUsuario) {

    //aqui pode atualizar ou excluir
    this.excluirContaBanco(conta.id)
  }

}
