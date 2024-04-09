import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormArray, UntypedFormControl, UntypedFormGroup, ValidatorFn, UntypedFormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core';
import { Conta } from 'app/models/conta';
import { ContaUsuario } from 'app/models/conta-usuario';
import { DialogEditUsuarioRegisterContaComponent } from 'app/routes/dialog/edit-usuario-register-conta/edit-usuario-register-conta.component';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe]
})
export class RegisterComponent {

  // userForm: FormGroup;
  isSubmitting: boolean = false;
  tokenCliente: string = ''
  listaBancos: string[] = ["Banco do Brasil", "Bradesco", "Itau"];
  listaTipoConta: string[] = [];
  listaContaUsuario: ContaUsuario[] = []
  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'actions'];
  contaUsuario: ContaUsuario[] = []
  dataSource = new MatTableDataSource<ContaUsuario>(this.contaUsuario);
  private idCount: number = 1;



  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private auth: AuthService) {
    // this.userForm = this.formBuilder.group({
    //   nome: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   cpf: [''],
    //   cnpj: [''],
    //   celular: ['', Validators.required],
    //   senha: ['', Validators.required],
    //   dataNascimento: ['', Validators.required],
    //   tokenCliente: [''],
    //   contas: this.formBuilder.array([]),
    //   contaCnpj: [false],

    // }, {
    //   validators: this.cpfCnpjRequiredValidator
    // });
  }

  public registerForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    nome: new UntypedFormControl(undefined, Validators.required),
    email: new UntypedFormControl(undefined, Validators.compose([Validators.required, Validators.email])),
    cpf: new UntypedFormControl(false),
    cnpj: new UntypedFormControl(""),
    celular: new UntypedFormControl(undefined, Validators.required),
    senha: new UntypedFormControl(undefined, Validators.required),
    dataNascimento: new UntypedFormControl(undefined, Validators.required),
    tokenCliente: new UntypedFormControl(undefined),
    contaCnpj: new UntypedFormControl(false),
    contas: new UntypedFormArray([]),
  }, { validators: this.cpfCnpjRequiredValidator });

  cpfCnpjRequiredValidator(): ValidatorFn {
    return () => {
      const cpfControl = this.registerForm.get('cpf');
      const cnpjControl = this.registerForm.get('cnpj');

      if (!cpfControl || !cnpjControl) {
        return null;
      }
      const cpf = cpfControl.value;
      const cnpj = cnpjControl.value;

      if (cpf || cnpj) {
        return null;
      }
      return { 'cpfCnpjRequired': true };
    };
  }


  ngOnInit() {
    this.tokenCliente = this.activatedRoute.snapshot.params['id'];
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);
    this.getCurrentDate()

  }

  // cpfCnpjRequiredValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
  //   const cpfControl = formGroup.get('cpf');
  //   const cnpjControl = formGroup.get('cnpj');

  //   if (!cpfControl || !cnpjControl) {
  //     return null;
  //   }
  //   const cpf = cpfControl.value;
  //   const cnpj = cnpjControl.value;

  //   if (cpf || cnpj) {
  //     return null;
  //   }
  //   return { 'cpfCnpjRequired': true };
  // }

  cpfCnpjBancoRequiredValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const cpfControl = formGroup.get('cpfBanco');
    const cnpjControl = formGroup.get('cnpjBanco');

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

  salvar() {
    const contasArray = this.registerForm.get('contas') as FormArray;

    if (contasArray.length <= 0) {
      this.toastr.warning('Adicione uma conta para concluir o cadastro.', 'Atenção')
      return;
    }


    this.auth.register(this.registerForm.getRawValue())

    this.toastr.success('Cadastro realizado com sucesso.', 'Sucesso')
    console.log('formulario: ', this.registerForm.value)
    console.log('lista: ', this.contaUsuario)

  }

  limparCpfCnpj() {
    this.registerForm.get('cpf')?.setValue('')
    this.registerForm.get('cnpj')?.setValue('')
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.registerForm.get('contaCnpj')?.setValue(event.checked);
    this.limparCpfCnpj();
  }

  onSubmit() { }

  adicionar() {
    if (this.registerForm.invalid) {
      this.toastr.warning('Preencha todos os dados pessoais primeiro.', 'Atenção')
      return;
    }
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditUsuarioRegisterContaComponent, {
      width: 'auto',
      panelClass: 'dialog-responsive',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.criarConta(result);
      }
    });
  }

  openDialogEditar(conta: ContaUsuario) {
    const dialogRef = this.dialog.open(DialogEditUsuarioRegisterContaComponent, {
      width: 'auto',
      panelClass: 'dialog-responsive',
      data: { conta: conta, exclusao: false } // Aqui você indica que não é uma operação de exclusão
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editarConta(result);
      }
    });
  }
  editarConta(conta: ContaUsuario) {
    const index = this.contaUsuario.findIndex(objeto => objeto.id === conta.id);

    if (index !== -1) {
      // const contasArray = this.userForm.get('contas') as FormArray;
      // contasArray.push(this.formBuilder.group(conta));
      const contasArray = this.registerForm.get('contas') as FormArray;
      const contaFormGroup = this.formBuilder.group(conta);
      contasArray.setControl(index, contaFormGroup);
      this.contaUsuario[index] = { ...conta };
      this.dataSource.data = [...this.contaUsuario];
      console.log(this.registerForm.value)
    }
  }

  openDialogDeletar(conta: ContaUsuario) {
    const dialogRef = this.dialog.open(DialogEditUsuarioRegisterContaComponent, {
      width: 'auto',
      panelClass: 'dialog-responsive',
      data: { conta: conta, exclusao: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletarConta(conta.id);
      }
    });
  }

  deletarConta(id: any) {
    const index = this.contaUsuario.findIndex(objeto => objeto.id === id);

    if (index !== -1) {
      const contasArray = this.registerForm.get('contas') as FormArray;
      contasArray.removeAt(index);
      this.contaUsuario.splice(index, 1);
      this.dataSource.data = [...this.contaUsuario];
      console.log(this.registerForm.value)
    }
  }

  criarConta(conta: ContaUsuario) {
    conta.id = this.generateId()
    const contasArray = this.registerForm.get('contas') as FormArray;
    contasArray.push(this.formBuilder.group(conta));
    this.contaUsuario.push(conta);
    this.dataSource.data = [...this.contaUsuario]
  }


  generateId(): number {
    return this.idCount++;
  }

  getCurrentDate(): void {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (formattedDate) {
      this.registerForm.get('dataNascimento')?.setValue(formattedDate);
    } else {
      console.error('Erro ao formatar a data.');
    }
  }
}
