import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { Conta } from 'app/models/conta';
import { ContaTerceiro } from 'app/models/conta-terceiro';
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
  selector: 'app-administracao-terceiros-fornecedor-fornecedor-conta',
  templateUrl: './fornecedor-conta.component.html',
  styleUrls: ['./fornecedor-conta.component.scss']
})
export class AdministracaoTerceirosFornecedorFornecedorContaComponent implements OnInit {

  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'actions'];

  usuario: Usuario = new Usuario();
  contaTerceiro: ContaTerceiro = new ContaTerceiro();
  // listaBancos: any[] = [];
  listaTipoConta: string[] = [];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  idFornecedor: number = 0
  idConta: number = 0
  listaBancos: any[]=[]


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contaBancariaService: ContaBancariaService,
    private toastrService: ToastrService,
    private mapeamentoEnumService: MapeamentoEnumService,
    private cdref: ChangeDetectorRef,
    private usuarioService: UsuarioService,
    private contaService: ContaBancariaService,
    private bancoService: BancosService
  ) {


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

  ngOnInit() {
    this.idFornecedor = this.activatedRoute.snapshot.params['id'];
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);
    this.preencheDadosUsuario()

    this.contaTerceiro.tipoPedido = 1
    this.contaTerceiro.terceiro.id = parseInt(this.idFornecedor.toString(), 10)
    this.idConta = this.activatedRoute.snapshot.params['idConta'];
    if (this.idConta > 0) {
      this.findContaById(this.idConta);
    }
  }


  findContaById(id: number) {
    this.contaService.getContaPorIdTerceiro(id).subscribe(
      (data: ContaTerceiro) => {

        this.contaTerceiro = data;
        this.userForm.get('cnpj')?.setValue(this.contaTerceiro.cnpj)
        this.userForm.get('cpf')?.setValue(this.contaTerceiro.cpf)
        this.userForm.get('contaCnpj')?.setValue(this.contaTerceiro.tipoCnpj)
        this.userForm.get('contaPadrao')?.setValue(this.contaTerceiro.contaPadrao)

        this.userForm.get('banco')?.setValue(this.contaTerceiro?.banco);

        this.contaTerceiro.tipoContaDTO = this.mapeamentoEnumService.mapearTipoContaDescricao(this.contaTerceiro.tipoConta)

        if (this.contaTerceiro.cnpj != '') {
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

  initScreen() {
    if (this.usuario != null) {
      if (this.usuario.cnpj != '') {
        this.userForm.get('contaCnpj')?.setValue(true)
        this.userForm.get('cnpj')?.setValue(this.usuario.cnpj)

      }
      else {
        this.userForm.get('contaCnpj')?.setValue(false)
        this.userForm.get('cpf')?.setValue(this.usuario.cpf)
      }
    }
  }

  onSubmit() {
  }


  preencheDadosUsuario() {
    this.usuarioService.getByToken().subscribe(
      (data: Usuario) => {
        this.usuario = data;
        this.initScreen()

      }
    )
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
          this.contaTerceiro = new ContaTerceiro()
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


  editarContaBanco(conta: any) {

  }
  excluirContaBanco(conta: any) {

  }

  voltar() {
    this.router.navigate(['/administracao/fornecedor-adicionar', this.idFornecedor]);
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
