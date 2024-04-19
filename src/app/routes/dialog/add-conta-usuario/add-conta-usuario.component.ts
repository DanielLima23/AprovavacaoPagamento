import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { Conta } from 'app/models/conta';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Usuario } from 'app/models/usuario';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { BancosService } from 'app/services-outros/bancos-service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { BancosBr } from 'app/util/bancos-br';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-add-conta-usuario',
  templateUrl: './add-conta-usuario.component.html',
  styleUrls: ['./add-conta-usuario.component.scss']
})
export class DialogAddContaUsuarioComponent implements OnInit {

  usuario: Usuario = new Usuario();
  contaUsuario: ContaUsuario = new ContaUsuario();
  listaTipoConta: string[] = [];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  idUsuario: number = 0
  idConta: number = 0
  listaBancos: any[] = []


  constructor(private formBuilder: FormBuilder,
    private contaBancariaService: ContaBancariaService,
    private toastrService: ToastrService,
    private mapeamentoEnumService: MapeamentoEnumService,
    private cdref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DialogAddContaUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idUsuario = data.idUsuario;

    this.userForm = this.formBuilder.group({
      banco: ['', Validators.required],
      agencia: ['', Validators.required],
      tipoConta: ['', Validators.required],
      conta: ['', Validators.required],
      chavePix: [''],
      contaCnpj: [false],
      cpf: [''],
      cnpj: [''],
      contaPadrao: [false]
    });
    this.preencheListaBancosBr()
    this.filteredBancos = this.userForm.controls['banco'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterBancos(value))
    );
  }

  voltar() {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.contaUsuario.tipoPedido = 1
    this.contaUsuario.usuario.id = parseInt(this.idUsuario.toString(), 10)
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);

  }

  salvar() {
    this.contaUsuario.cpf = this.userForm.get('cpf')?.value.toString()
    this.contaUsuario.cnpj = this.userForm.get('cnpj')?.value.toString()
    this.contaUsuario.banco = this.userForm.get('banco')?.value.toString()
    this.contaUsuario.tipoConta = this.mapeamentoEnumService.mapearTipoContaId(this.contaUsuario.tipoContaDTO);
    this.contaUsuario.tipoCnpj = this.userForm.get('contaCnpj')?.value
    this.contaUsuario.contaPadrao = this.userForm.get('contaPadrao')?.value

    if (this.idConta <= 0 || this.idConta == undefined) {
      this.contaBancariaService.registerContaUsuario(this.contaUsuario).subscribe(
        (data: Conta) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.dialogRef.close(data.id);
        },
        (error: any) => {
          this.toastrService.error('Erro ao salvar: ' + error.message, 'Erro');
        }
      )
    } else {
      this.contaBancariaService.updateContaUsuario(this.idConta, this.contaUsuario).subscribe(
        (data: Conta) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.contaUsuario = new ContaUsuario()
        },
        (error: any) => {
          this.toastrService.error('Erro ao salvar: ' + error.message, 'Erro');
        }
      )
    }
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
    this.cdref.detectChanges();

    this.limparCpfCnpj();
  }

  preencheListaBancosBr() {
    this.listaBancos = BancosBr.bancosBrasil
  }

  filteredBancos: Observable<any[]> | undefined;
  private _filterBancos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaBancos.filter(banco => banco.toLowerCase().includes(filterValue));
  }

}
