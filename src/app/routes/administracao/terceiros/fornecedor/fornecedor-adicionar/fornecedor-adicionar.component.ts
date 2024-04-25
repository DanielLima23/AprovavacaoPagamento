import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, UntypedFormControl, Validators, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { Terceiro } from 'app/models/terceiro';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { DialogEditContaTerceiroDialogComponent } from 'app/routes/dialog/edit-conta-terceiro-dialog/edit-conta-terceiro-dialog.component';
import { TerceiroService } from 'app/routes/administracao/terceiros/terceiro.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-terceiros-fornecedor-fornecedor-adicionar',
  templateUrl: './fornecedor-adicionar.component.html',
  styleUrls: ['./fornecedor-adicionar.component.scss']
})
export class AdministracaoTerceirosFornecedorFornecedorAdicionarComponent implements OnInit {

  fornecedor: Terceiro = new Terceiro();
  isSubmitting = false;
  contaCnpj: boolean = false;
  token: any = "";
  listaBancos: string[] = ["Banco do Brasil", "Bradesco", "Itau"];
  listaFormaPagamento: string[] = [];
  listaCentroCusto: CentroDeCusto[] = []
  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'actions'];
  idFornecedor: number = 0
  listaContasTerceiro: ContaTerceiro[] = []

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private terceiroService: TerceiroService,
    private toastrService: ToastrService,
    private centroCustoService: CentroDeCustoService,
    private activatedRoute: ActivatedRoute,
    private mapeamentoEnumService: MapeamentoEnumService,
    private contaTerceiroService: ContaBancariaService,
    private cdref: ChangeDetectorRef,
    private dialog: MatDialog

  ) {

    this.fornecedorForm.setValidators(this.cpfCnpjRequiredValidator());

    // this.fornecedorForm.valueChanges.subscribe(s => {
    //   console.log(s);
    // });
  }


  ngOnInit() {
    this.listaFormaPagamento = FormasPagamentoSelect.formasPagamento.map(forma => forma.descricao);
    this.idFornecedor = 0;
    this.preencheListaCentros()
    this.idFornecedor = this.activatedRoute.snapshot.params['id'];
    if (this.idFornecedor) {
      this.findFornecedorById(this.idFornecedor);
      this.preencheListaContasTerceiro()
    }
  }


  public fornecedorForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    nome: new UntypedFormControl(undefined, Validators.required),
    finalidade: new UntypedFormControl(undefined, Validators.required),
    contaCnpj: new UntypedFormControl(false),
    cpf: new UntypedFormControl(""),
    cnpj: new UntypedFormControl(""),
    // tipoPagamento: new UntypedFormControl(undefined),
    // tipoPagamentoDTO: new UntypedFormControl(undefined),
    idCentroCusto: new UntypedFormControl(undefined, Validators.required),
    tipoTerceiro: new UntypedFormControl(1),
  }, { validators: this.cpfCnpjRequiredValidator });


  findFornecedorById(pIdFornecedor: number) {
    this.terceiroService.getTerceiroById(pIdFornecedor).subscribe(
      (data: Terceiro) => {
        this.fornecedorForm.patchValue(data)
        this.fornecedorForm.get('tipoPagamentoDTO')?.setValue(this.mapeamentoEnumService.mapearTipoPagamentoDescricao(data.tipoPagamento));
        this.ajustesConta(data)
        if (this.fornecedor.cnpj) {
          this.contaCnpj = true;
        } else {
          this.contaCnpj = false;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ajustesConta(data: any) {
    if (this.fornecedorForm.value.cnpj == '') {
      this.fornecedorForm.get('cnpj')?.setValue('')
      this.fornecedorForm.get('cpf')?.setValue(data.cpf)
      this.fornecedorForm.get('contaCnpj')?.setValue(false)
    } else {
      this.fornecedorForm.get('cnpj')?.setValue(data.cnpj)
      this.fornecedorForm.get('cpf')?.setValue('')
      this.fornecedorForm.get('contaCnpj')?.setValue(true)
    }
  }

  setTipoPagamento() {
    this.fornecedorForm.get('tipoPagamento')?.setValue(this.mapeamentoEnumService.mapearTipoPagamentoId(this.fornecedorForm.value.tipoPagamentoDTO));
  }

  voltar() {
    this.router.navigate(['administracao/fornecedor-consultar']);
  }

  salvar() {

    if (this.fornecedorForm.value.id <= 0 || this.fornecedorForm.value.id == undefined) {
      this.terceiroService.registerTerceiro(this.fornecedorForm.getRawValue()).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.fornecedorForm.reset()
        }
      )
    } if (this.fornecedorForm.value.id > 0) {
      this.terceiroService.updateTerceiro(this.fornecedorForm.value.id, this.fornecedorForm.getRawValue()).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.fornecedorForm.reset()
        }
      )
    }

  }

  limparCpfCnpj() {
    this.fornecedorForm.get('cpf')?.setValue('')
    this.fornecedorForm.get('cnpj')?.setValue('')
  }

  cpfCnpjRequiredValidator(): ValidatorFn {
    return () => {
      const cpfControl = this.fornecedorForm.get('cpf');
      const cnpjControl = this.fornecedorForm.get('cnpj');

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

  adicionarConta() {
    this.router.navigate(['/fornecedor/conta', this.fornecedor.id]);
  }

  editarContaBanco(id: number) {
    this.router.navigate(['/fornecedor/conta', this.fornecedor.id, id]);
  }

  excluirContaBanco(id: any) {
    this.contaTerceiroService.deleteContaTerceiroById(id).subscribe(
      (data: any) => {
        this.toastrService.success('Excluido com sucesso!', 'Sucesso');
        this.preencheListaContasTerceiro()
      }
    )
  }

  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  preencheListaContasTerceiro() {
    this.contaTerceiroService.getListContasPorIdTerceiro(this.idFornecedor).subscribe(
      (data: ContaTerceiro[]) => {
        this.listaContasTerceiro = data;
      }
    )
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;
    this.cdref.detectChanges();

    this.limparCpfCnpj();
  }


  openDialogDelete(conta: ContaTerceiro): void {
    const dialogRef = this.dialog.open(DialogEditContaTerceiroDialogComponent, {
      width: '350px',
      data: { ...conta },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarConta(result.id, result);
      }
    });
  }

  atualizarConta(id: any, conta: ContaTerceiro) {
    this.excluirContaBanco(conta.id)
  }

}
