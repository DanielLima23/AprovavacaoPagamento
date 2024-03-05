import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { FornecedorConsultarComponent } from '../consultar/consultar.component';
import { Banco } from 'app/models/banco';
import { Terceiro } from 'app/models/terceiro';
import { FornecedorService } from '../fornecedor.service';
import { ToastrService } from 'ngx-toastr';
import { TipoConta } from 'app/models/enum/tipo-conta.enum';
import { TipoPagamento } from 'app/models/enum/tipo-pagamento.enum';
import { CentroDeCustoService } from 'app/routes/centro-de-custo/centro-de-custo.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DialogEditContaTerceiroDialogComponent } from 'app/routes/dialog/edit-conta-terceiro-dialog/edit-conta-terceiro-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-fornecedor-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss']
})
export class FornecedorAdicionarComponent implements OnInit {

  fornecedor: Terceiro = new Terceiro();
  isSubmitting = false;
  userForm: FormGroup;
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
    private fornecedorService: FornecedorService,
    private toastrService: ToastrService,
    private centroCustoService: CentroDeCustoService,
    private activatedRoute: ActivatedRoute,
    private mapeamentoEnumService: MapeamentoEnumService,
    private contaTerceiroService: ContaBancariaService,
    private cdref: ChangeDetectorRef,
    private dialog: MatDialog

  ) {
    this.userForm = this.formBuilder.group({
      fornecedor: ['', Validators.required],
      finalidade: ['', [Validators.required]],
      cnpj: [''],
      cpf: [''],
      idCentroCusto: ['',Validators.required],
      formaPagamento: ['', Validators.required],
      contaCnpj: [false],

    }, {
      validators: this.cpfCnpjRequiredValidator
    });
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

  findFornecedorById(pIdFornecedor: number) {
    this.fornecedorService.getForncedorById(pIdFornecedor).subscribe(
      (data: Terceiro) => {

        this.fornecedor = data;
        this.fornecedor.tipoPagamentoDTO = this.mapeamentoEnumService.mapearTipoPagamentoDescricao(this.fornecedor.tipoPagamento);
        this.ajustesConta(this.fornecedor)
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
    if(this.fornecedor.cnpj == ''){
      this.userForm.get('cnpj')?.setValue('')
      this.userForm.get('cpf')?.setValue(data.cpf)
      this.userForm.get('contaCnpj')?.setValue(false)
    }else{
      this.userForm.get('cnpj')?.setValue(data.cnpj)
      this.userForm.get('cpf')?.setValue('')
      this.userForm.get('contaCnpj')?.setValue(true)
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      const userData: Terceiro = this.userForm.value;
      console.log(userData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 3000);
    }
  }

  voltar() {
    this.router.navigate(['/fornecedor/consultar']);

  }
  salvar() {
    this.fornecedor.tipoTerceiro = 1
    this.fornecedor.cpf = this.userForm.get('cpf')?.value.toString()
    this.fornecedor.cnpj = this.userForm.get('cnpj')?.value.toString()
    this.fornecedor.tipoPagamento = this.mapeamentoEnumService.mapearTipoPagamentoId(this.fornecedor.tipoPagamentoDTO);

    if (this.idFornecedor <= 0 || this.idFornecedor == undefined) {
      this.fornecedorService.registerFornecedor(this.fornecedor).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.fornecedor = data
          this.fornecedor.tipoPagamentoDTO = this.mapeamentoEnumService.mapearTipoPagamentoDescricao(this.fornecedor.tipoPagamento);
        }
      )
    } else {
      this.fornecedorService.updateFornecedor(this.idFornecedor, this.fornecedor).subscribe(
        (data: any) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.fornecedor = new Terceiro()
        }
      )
    }

  }

  limparCpfCnpj() {

    this.userForm.get('cpf')?.setValue('')
    this.userForm.get('cnpj')?.setValue('')
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

    //aqui pode atualizar ou excluir
    this.excluirContaBanco(conta.id)
  }
}
