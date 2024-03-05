import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Banco } from 'app/models/banco';
import { Conta } from 'app/models/conta';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { FornecedorService } from '../fornecedor.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { Cliente } from 'app/models/cliente';
import { Observable, startWith, map } from 'rxjs';
import { BancosService } from 'app/services-outros/bancos-service';
import { BancosBr } from 'app/util/bancos-br';

@Component({
  selector: 'app-fornecedor-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class FornecedorContaComponent implements OnInit {

  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'actions'];

  fornecedor: Terceiro = new Terceiro();
  contaTerceiro: ContaTerceiro = new ContaTerceiro()
  listaBancos: any[] = [];
  listaTipoConta: string[] = [];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  idFornecedor: number = 0
  idConta: number = 0


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fornecedorService: FornecedorService,
    private contaBancariaService: ContaBancariaService,
    private toastrService: ToastrService,
    private mapeamentoEnumService: MapeamentoEnumService,
    private cdref: ChangeDetectorRef,
    private contaService: ContaBancariaService,
    private bancoService: BancosService
  ) {
    this.userForm = this.formBuilder.group({
      banco: ['',Validators.required ],
      agencia: ['', Validators.required],
      tipoConta: ['', Validators.required],
      conta: ['', Validators.required],
      chavePix: [''],
      contaCnpj: [false],
      // contaTerceiro: this.formBuilder.group({
      //   cpf: [''], // valor inicial para cpf
      //   cnpj: [''] // valor inicial para cnpj
      // })
      cpf: [''],
      cnpj: [''],
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
    this.idFornecedor = this.activatedRoute.snapshot.params['id'];
    this.idConta = this.activatedRoute.snapshot.params['idConta'];

    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);
    this.preencheDadosFornecedor()
    this.contaTerceiro.tipoPedido = 1
    this.contaTerceiro.terceiro.id = parseInt(this.idFornecedor.toString(), 10)
    if (this.idConta) {
      this.findContaById(this.idConta);
    }


  }

  ajustesConta(data: any) {
    this.userForm.get('cnpj')?.setValue(this.contaTerceiro.cnpj)
    this.userForm.get('cpf')?.setValue(this.contaTerceiro.cpf)
    this.userForm.get('contaCnpj')?.setValue(this.contaTerceiro.tipoCnpj)
    this.userForm.get('banco')?.setValue(this.contaTerceiro?.banco);

    this.contaTerceiro.tipoContaDTO = this.mapeamentoEnumService.mapearTipoContaDescricao(this.contaTerceiro.tipoConta)

    // this.fornecedor.tipoPagamentoDTO = this.mapeamentoEnumService.mapearTipoPagamentoDescricao(this.fornecedor.tipoPagamento);
    if (this.contaTerceiro.cnpj != '') {
      this.contaCnpj = true;
    } else {
      this.contaCnpj = false;
    }
  }

  findContaById(id: number) {
    this.contaService.getContaPorIdTerceiro(id).subscribe(
      (data: ContaTerceiro) => {
        this.contaTerceiro = data;
        this.ajustesConta(this.contaTerceiro)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  initScreen() {
    if (this.fornecedor != null) {
      if (this.fornecedor.cnpj != '') {
        this.userForm.get('contaCnpj')?.setValue(true)
        this.userForm.get('cnpj')?.setValue(this.fornecedor.cnpj)

      }
      else {
        this.userForm.get('contaCnpj')?.setValue(false)
        this.userForm.get('cpf')?.setValue(this.fornecedor.cpf)
      }
    }
  }

  onSubmit() {
  }



  preencheDadosFornecedor() {
    this.fornecedorService.getForncedorById(this.idFornecedor).subscribe(
      (data: Terceiro) => {
        this.fornecedor = data;
        this.initScreen()

      }
    )
  }

  salvar() {
    this.contaTerceiro.cpf = this.userForm.get('cpf')?.value.toString()
    this.contaTerceiro.cnpj = this.userForm.get('cnpj')?.value.toString()
    this.contaTerceiro.tipoConta = this.mapeamentoEnumService.mapearTipoContaId(this.contaTerceiro.tipoContaDTO);
    this.contaTerceiro.tipoCnpj = this.userForm.get('contaCnpj')?.value
    this.contaTerceiro.banco = this.userForm.get('banco')?.value.toString()


    if (this.idConta <= 0 || this.idConta == undefined) {
      this.contaBancariaService.registerContaTerceiro(this.contaTerceiro).subscribe(
        (data: ContaTerceiro) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.contaTerceiro = new ContaTerceiro()
          this.ajustesConta(this.contaTerceiro)
        }
      )
    } else {
      this.contaBancariaService.updateContaTerceiro(this.idConta, this.contaTerceiro).subscribe(
        (data: ContaTerceiro) => {
          this.toastrService.success('Salvo com sucesso!', 'Sucesso');
          this.contaTerceiro = new ContaTerceiro()
          this.ajustesConta(this.contaTerceiro)
        }
      )
    }

  }



  editarContaBanco(conta: any) {

  }
  excluirContaBanco(conta: any) {

  }

  voltar() {
    this.router.navigate(['/fornecedor/adicionar', this.idFornecedor]);
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

  // myControl = new FormControl('');
  // filteredOptions: Observable<any[]> | undefined;

  // public filtrarOpcoes() {
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     startWith(''),
  //     map((value: any) => typeof value === 'string' ? value : (value ? value.label : '')),
  //     map(label => this._filter(label))
  //   ) as Observable<any[]>;

  // }
  // private _filter(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   this.userForm.get('banco')?.setValue(value)
  //   return this.listaBancos.filter(option => option.label.toLowerCase().includes(filterValue));
  // }

  // preencheListaBancosBr() {
  //   this.bancoService.getBancos().subscribe(data => {
  //     this.listaBancos = data;
  //     this.filtrarOpcoes();
  //   });
  // }

  preencheListaBancosBr() {
    // this.bancoService.getBancos().subscribe(data => {
    //   this.listaBancos = data;
    // });

    this.listaBancos = BancosBr.bancosBrasil
  }

  filteredBancos: Observable<any[]> | undefined;
  private _filterBancos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaBancos.filter(banco => banco.toLowerCase().includes(filterValue));
  }

}
