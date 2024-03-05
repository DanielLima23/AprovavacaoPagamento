import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { Conta } from 'app/models/conta';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Usuario } from 'app/models/usuario';
import { FornecedorService } from 'app/routes/fornecedor/fornecedor.service';
import { BancosService } from 'app/services-outros/bancos-service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { BancosBr } from 'app/util/bancos-br';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-edit-usuario-register-conta',
  templateUrl: './edit-usuario-register-conta.component.html',
  styleUrls: ['./edit-usuario-register-conta.component.scss']
})
export class DialogEditUsuarioRegisterContaComponent implements OnInit {

  listaBancos: any[] = []
  userForm: FormGroup;
  contaCnpj: boolean = false;
  filteredBancos: Observable<any[]> | undefined;
  listaTipoConta: string[] = [];
  contaUsuario: ContaUsuario = new ContaUsuario()
  private idCount: number = 1;


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogEditUsuarioRegisterContaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService

  ) {

    this.contaUsuario = {...data}
    this.userForm = this.formBuilder.group({
      banco: ['', Validators.required],
      agencia: ['', Validators.required],
      tipoConta: ['', Validators.required],
      conta: ['', Validators.required],
      chavePix: [''],
      contaCnpj: [false],
      cpf: [''],
      cnpj: [''],
      contaPadrao: [false],
      id: []
    }, {
      validators: this.cpfCnpjRequiredValidator
    });
    this.preencheListaBancosBr()
    this.filteredBancos = this.userForm.controls['banco'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterBancos(value))
    );
  }

  ngOnInit() {
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);
    if (this.data && this.data.conta) {
      this.userForm.patchValue(this.data.conta);
    }
  }

  private _filterBancos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaBancos.filter(banco => banco.toLowerCase().includes(filterValue));
  }
  preencheListaBancosBr() {
    this.listaBancos = BancosBr.bancosBrasil
  }

  cpfCnpjRequiredValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const cpfControl = formGroup.get('cpf');
    const cnpjControl = formGroup.get('cnpj');

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
    this.userForm.get('cpf')?.setValue('')
    this.userForm.get('cnpj')?.setValue('')
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;

    this.limparCpfCnpj();
  }

  onSubmit() {
  }


  salvar() {
    if (this.userForm.valid) {
      const conta = this.userForm.value as ContaUsuario;
      this.dialogRef.close(conta);
    } else {
      this.toastr.error('Por favor, preencha todos os campos corretamente.', 'Erro ao salvar');
    }
  }
  generateId(): number {
    return this.idCount++;
  }

  voltar(){
    this.dialogRef.close();

  }




}
