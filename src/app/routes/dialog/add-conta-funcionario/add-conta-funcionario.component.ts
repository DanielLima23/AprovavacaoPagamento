import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Conta } from 'app/models/conta';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Usuario } from 'app/models/usuario';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { BancosBr } from 'app/util/bancos-br';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { startWith, map, Observable } from 'rxjs';
import { DialogAddContaUsuarioComponent } from '../add-conta-usuario/add-conta-usuario.component';
import { ContaTerceiro } from 'app/models/conta-terceiro';

@Component({
  selector: 'app-dialog-add-conta-funcionario',
  templateUrl: './add-conta-funcionario.component.html',
  styleUrls: ['./add-conta-funcionario.component.scss']
})
export class DialogAddContaFuncionarioComponent implements OnInit {
  usuario: Usuario = new Usuario();
  contaTerceiro: ContaTerceiro = new ContaTerceiro();
  listaTipoConta: string[] = [];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  idTerceiro: number = 0
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
    this.idTerceiro = data.idTerceiro;

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
    this.contaTerceiro.tipoPedido = 2
    this.contaTerceiro.terceiro.id = parseInt(this.idTerceiro.toString(), 10)
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);

  }

  salvar() {
    this.contaTerceiro.cpf = this.userForm.get('cpf')?.value.toString()
    this.contaTerceiro.cnpj = this.userForm.get('cnpj')?.value.toString()
    this.contaTerceiro.banco = this.userForm.get('banco')?.value.toString()
    this.contaTerceiro.tipoConta = this.mapeamentoEnumService.mapearTipoContaId(this.contaTerceiro.tipoContaDTO);
    this.contaTerceiro.tipoCnpj = this.userForm.get('contaCnpj')?.value
    this.contaTerceiro.contaPadrao = this.userForm.get('contaPadrao')?.value

    if (this.idConta <= 0 || this.idConta == undefined) {
      this.contaBancariaService.registerContaTerceiro(this.contaTerceiro).subscribe(
        (data: Conta) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.dialogRef.close(data.id);
        },
        (error: any) => {
          this.toastrService.error('Erro ao salvar: ' + error.message, 'Erro');
        }
      )
    } else {
      this.contaBancariaService.updateContaTerceiro(this.idConta, this.contaTerceiro).subscribe(
        (data: Conta) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.contaTerceiro = new ContaTerceiro()
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
