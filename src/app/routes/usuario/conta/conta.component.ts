import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Banco } from 'app/models/banco';
import { Conta } from 'app/models/conta';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { FornecedorService } from 'app/routes/fornecedor/fornecedor.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { TipoContaSelect } from 'app/util/classes/select-tipo-conta';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';
import { ContaUsuario } from 'app/models/conta-usuario';
import { BancosService } from 'app/services-outros/bancos-service';
import { Observable, map, startWith } from 'rxjs';
import { BancosBrasil } from 'app/models/auxiliar/bancos-brasil';
import { BancosBr } from 'app/util/bancos-br';

@Component({
  selector: 'app-usuario-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class UsuarioContaComponent implements OnInit {


  displayedColumns: string[] = ['banco', 'agencia', 'conta', 'chavePix', 'actions'];

  usuario: Usuario = new Usuario();
  contaUsuario: ContaUsuario = new ContaUsuario();
  // listaBancos: any[] = [];
  listaTipoConta: string[] = [];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  idUsuario: number = 0
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
    this.idUsuario = this.activatedRoute.snapshot.params['id'];
    this.listaTipoConta = TipoContaSelect.tiposConta.map(forma => forma.descricao);
    this.preencheDadosUsuario()

    this.contaUsuario.tipoPedido = 1
    this.contaUsuario.usuario.id = parseInt(this.idUsuario.toString(), 10)
    this.idConta = this.activatedRoute.snapshot.params['idConta'];
    if (this.idConta > 0) {
      this.findContaById(this.idConta);
    }
  }


  findContaById(id: number) {
    this.contaService.getContaPorIdUsuario(id).subscribe(
      (data: ContaUsuario) => {

        this.contaUsuario = data;
        this.userForm.get('cnpj')?.setValue(this.contaUsuario.cnpj)
        this.userForm.get('cpf')?.setValue(this.contaUsuario.cpf)
        this.userForm.get('contaCnpj')?.setValue(this.contaUsuario.tipoCnpj)
        this.userForm.get('contaPadrao')?.setValue(this.contaUsuario.contaPadrao)

        this.userForm.get('banco')?.setValue(this.contaUsuario?.banco);

        this.contaUsuario.tipoContaDTO = this.mapeamentoEnumService.mapearTipoContaDescricao(this.contaUsuario.tipoConta)

        if (this.contaUsuario.cnpj != '') {
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
          this.contaUsuario = new ContaUsuario()
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


  editarContaBanco(conta: any) {

  }
  excluirContaBanco(conta: any) {

  }

  voltar() {
    this.router.navigate(['/usuario/editar', this.idUsuario]);
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
