import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Arquivo } from 'app/models/auxiliar/arquivo';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { Parcelas } from 'app/models/parcelas';
import { PedidoPagamento } from 'app/models/pedidoPagamento';
import { Rateio } from 'app/models/rateio';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { TerceiroService } from 'app/routes/administracao/terceiros/terceiro.service';
import { DialogAddContaFuncionarioComponent } from 'app/routes/dialog/add-conta-funcionario/add-conta-funcionario.component';
import { DialogConfirmacaoComponent } from 'app/routes/dialog/confirmacao/confirmacao.component';
import { DialogEditParcelaDialogComponent } from 'app/routes/dialog/edit-parcela-dialog/edit-parcela-dialog.component';
import { DialogEditRateioDialogComponent } from 'app/routes/dialog/edit-rateio-dialog/edit-rateio-dialog.component';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { TipoRateioSelect } from 'app/util/classes/select-tipo-rateio';
import { TipoTerceiroSelect } from 'app/util/classes/select-tipo-terceiro';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PedidoService } from '../pedido.service';
import { ContaUsuario } from 'app/models/conta-usuario';
import { DialogAddContaUsuarioComponent } from 'app/routes/dialog/add-conta-usuario/add-conta-usuario.component';

@Component({
  selector: 'app-pedido-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class PedidoUsuarioComponent implements OnInit {

  ultimoPedido: any

  displayedColumns: string[] = ['data', 'valor', 'actions'];
  displayedColumnsRateio: string[] = ['nome', 'valor', 'actions'];

  displayedColumnsFiles: string[] = ['file', 'actions'];
  isSubmitting = false;
  // userForm: FormGroup;
  contaCnpj: boolean = false;
  pedidoPagamento: PedidoPagamento = new PedidoPagamento();
  listaBancos: string[] = [];
  listaFormaPagamento: { id: number; descricao: string }[] = FormasPagamentoSelect.formasPagamento;
  quantidadeMaximaParcela: number[] = []
  pgtoParcelado: boolean = false;
  currentDate: string = "";
  idUsuario: number = 0;
  listaContasUsuario: ContaUsuario[] = []
  parcelas: any[] = [];
  rateio: Rateio[] = [];
  numFilesAttached: number = 0;
  fileNames: string[] = [];
  limiteArquivos: number = 10;
  filesDisplay: string = '';
  dataSource = new MatTableDataSource<Parcelas>(this.parcelas);
  dataSourceRateio = new MatTableDataSource<Rateio>(this.rateio);
  dataSourceFile = new MatTableDataSource<Arquivo>();
  listaArquivo: Arquivo[] = []
  // listaTiposTerceiro: string[] = []
  telaFucnionario: boolean = false;
  telaFornecedor: boolean = false;
  listaCentroCusto: CentroDeCusto[] = []
  listaTipoRateio: { id: number; descricao: string }[] = [];
  listaUsuarios: Usuario[] = []
  arquivosBase64: Arquivo[] = [];
  listaUsuario: any[] = []
  @Input() isIdPedidoPorParcela = 0
  filteredFornecedor: Observable<any[]> | undefined;
  isUltimoPedido: boolean = false;
  listaObservacoes: any[] = []

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private usuarioService: UsuarioService,
    private contaService: ContaBancariaService,
    private mapeamentoEnumService: MapeamentoEnumService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private centroCustoService: CentroDeCustoService,
    private currencyPipe: CurrencyPipe,
    private pedidoService: PedidoService,
    private activatedRoute: ActivatedRoute,
    // private terceiroService: TerceiroService
  ) {


    this.meuPedidoForm.valueChanges.subscribe(s => {
      console.log(s);
    });
    this.meuPedidoForm.valueChanges.subscribe(s => {
      console.log(s);
    });
    const formaPagamentoArray = this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray;
    formaPagamentoArray.push(this.formaPagamentoForm);
    const parcelaArrqay = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    parcelaArrqay.push(this.parcelaForm);
  }

  public meuPedidoForm: UntypedFormGroup = new UntypedFormGroup({

    ID: new UntypedFormControl(0),
    TipoPedido: new UntypedFormControl(0),
    // TerceiroID: new UntypedFormControl(0),
    UsuarioID:new  UntypedFormControl(undefined),
    descricao: new UntypedFormControl(undefined),
    listaFormaPagamento: new UntypedFormArray([]),
    nome: new UntypedFormControl(undefined, Validators.required),
    cpf: new UntypedFormControl(undefined),
    cnpj: new UntypedFormControl(undefined),
    contaCnpj: new UntypedFormControl(undefined),
    anexo: new UntypedFormArray([]),
    valorTotalPedido: new UntypedFormControl(undefined)
  });


  public formaPagamentoForm = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    idUsuario: new UntypedFormControl(0),
    idCentroDeCusto: new UntypedFormControl(0, Validators.required),
    rateioID: new UntypedFormControl(0),
    idContaBancaria: new UntypedFormControl(undefined, Validators.required),
    //idContaBancariaTerceiro: new UntypedFormControl(undefined, Validators.required),
    tipoPagamento: new UntypedFormControl(0),
    valorTotal: new UntypedFormControl(undefined, Validators.required),
    quantidadeParcelas: new UntypedFormControl(1),
    valorParcela: new UntypedFormControl(0),
    dataPagamento: new UntypedFormControl(undefined, Validators.required),
    dataVencimento: new UntypedFormControl(undefined, Validators.required),
    descricao: new UntypedFormControl(undefined),
    listaParcelas: new UntypedFormArray([]),

    tipoConta: new UntypedFormControl(undefined),
    agencia: new UntypedFormControl(undefined),
    conta: new UntypedFormControl(undefined),
    pix: new UntypedFormControl(undefined),

    pedidoParcelado: new UntypedFormControl(false),
    gerarParcelas: new UntypedFormControl(false),

    exibirParcelas: new UntypedFormControl(false),
    // tipoTerceiro: new UntypedFormControl(this.listaTiposTerceiro[0]),
    rateio: new UntypedFormControl(false),
    usuarioRateio: new UntypedFormControl(undefined),
    valorRateioPessoa: new UntypedFormControl(undefined)
  });

  public parcelaForm = new UntypedFormGroup({
    id: new UntypedFormControl(0),
    parcelaReferencia: new UntypedFormControl(1),
    quantidadeParcelas: new UntypedFormControl(1),

    valorParcela: new UntypedFormControl(undefined),
    dataPagamento: new UntypedFormControl(undefined),
    dataVencimento: new UntypedFormControl(undefined)
  })

  public removerFormaPagamento(index: number) {
    (this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray).removeAt(index);
  }

  alterarPropriedadeFormaPagamento(index: number, propriedade: string, valor: any) {
    const formaPagamento = (this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray).at(index);
    formaPagamento.get(propriedade)?.setValue(valor);
  }

  adicionarParcela() {
    const novaParcela = new UntypedFormGroup({
      id: new UntypedFormControl(),
      parcelaReferencia: new UntypedFormControl(),
      valorParcela: new UntypedFormControl(),
      dataPagamento: new UntypedFormControl(),
      dataVencimento: new UntypedFormControl()
    });

    const listaFormaPagamento = this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray;
    const ultimaFormaPagamento = listaFormaPagamento.at(listaFormaPagamento.length - 1) as UntypedFormGroup;
    const listaParcelas = ultimaFormaPagamento.get('listaParcelas') as UntypedFormArray;
    listaParcelas.push(novaParcela);
  }

  removerParcela(indexFormaPagamento: number, indexParcela: number) {
    ((this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray).at(indexFormaPagamento).get('listaParcelas') as UntypedFormArray).removeAt(indexParcela);
  }

  setDescricaoNaFormaPagamentoForm() {
    this.meuPedidoForm.get('descricao')?.setValue(this.formaPagamentoForm.get('descricao')?.value)
  }

  @Input() idPedido: number = 0;
  isRelatorio: any

  ngOnInit() {
    this.preencheListaUsuario()

    this.idPedido = history.state.id;
    this.isRelatorio = history.state.relatorio
    if (this.idPedido == null || this.idPedido == undefined) {
      this.idPedido = this.isIdPedidoPorParcela
    }

    if (this.idPedido > 0) {
      this.formaPagamentoForm.disable();
      this.meuPedidoForm.disable()
      this.findPedidoByCodigo()
      return;
    }
    this.desabilitarCamposAntesDeSelecionarUsuario()

    this.idPedido = 0
    this.desabilitarInputs()
    this.getCurrentDate();
    // this.listaTiposTerceiro = TipoTerceiroSelect.tiposTerceiro.map(terceiro => terceiro.descricao);
    this.listaTipoRateio = TipoRateioSelect.tipoRateio
    this.preencheQtdParcelas()
  }

  dataUltimoPedido: any
  retornaUltimoPedido(id: any) {
    this.pedidoService.getUltimoPedidoTerceiro(id).subscribe(
      (data: any) => {
        this.ultimoPedido = data
        if (this.ultimoPedido == null || this.ultimoPedido == undefined) {
          this.dataUltimoPedido = ""
          this.limparTela()
        } else {
          this.dataUltimoPedido = this.ultimoPedido.dataCadastro
        }
      }
    )
  }

  usarUltimoPedido() {
    this.setUltimoPedidoEmTela()
  }

  setUltimoPedidoEmTela() {
    this.preencheListaUsuario()
    this.usuarioService.getById(this.ultimoPedido.formaPagamento[0].terceiro.id).subscribe(
      (terceiro: any) => {
        this.meuPedidoForm.get('nome')?.setValue(terceiro.nome);
        if (terceiro.cpf) {
          this.meuPedidoForm.get('cpf')?.setValue(terceiro.cpf);
          this.meuPedidoForm.get('contaCnpj')?.setValue(false);
        } else {
          this.meuPedidoForm.get('cnpj')?.setValue(terceiro.cnpj);
          this.meuPedidoForm.get('contaCnpj')?.setValue(true);
        }
        this.meuPedidoForm.get('TerceiroID')?.setValue(terceiro.id);
      }
    )

    this.contaService.getListContasPorIdUsuario(this.ultimoPedido.usuario.id).subscribe(
      (data: any[]) => {
        this.listaContasUsuario = data
        const contaSelecionada = this.listaContasUsuario.find(conta => conta.id === this.ultimoPedido.formaPagamento[0].contaBancaria ? this.ultimoPedido.formaPagamento[0].contaBancaria.id : this.ultimoPedido.formaPagamento[0].contaBancariaTerceiro.id)?.id
        this.formaPagamentoForm.get('idContaBancaria')?.setValue(contaSelecionada)
        this.atualizarDadosBancariosInput()
      }
    )


    this.formaPagamentoForm.get('tipoPagamento')?.setValue(this.ultimoPedido.formaPagamento[0].tipoPagamento)

    const formatador = new FormatadorData();
    const hoje: Date = new Date();
    const dataAtual: string = hoje.toISOString().slice(0, 10);
    this.formaPagamentoForm.get('dataPagamento')?.setValue(dataAtual)
    this.formaPagamentoForm.get('dataVencimento')?.setValue(dataAtual)
    // this.formaPagamentoForm.get('valorTotal')?.setValue(this.ultimoPedido.formaPagamento[0].valorTotal)
    let valorTotal = this.ultimoPedido.formaPagamento[0].valorTotal.toFixed(2).toString();
    const partes = valorTotal.split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let parteDecimal = partes[1] || '00';
    parteDecimal = parteDecimal.padEnd(2, '0');
    valorTotal = parteInteira + ',' + parteDecimal;
    this.formaPagamentoForm.get('valorTotal')?.setValue(valorTotal)

    this.formaPagamentoForm.get('descricao')?.setValue(this.ultimoPedido.descricao)
    //this.preencheListaCentros(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)
    //this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)

    // if (this.ultimoPedido.formaPagamento[0].parcelas.length > 1) {
    //   this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
    //   this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
    //   this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(this.ultimoPedido.formaPagamento[0].quantidadeParcelas)
    //   this.gerarParcelas()
    // }

    if (this.ultimoPedido.formaPagamento[0].parcelas.length > 1) {
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
      this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(this.ultimoPedido.formaPagamento[0].quantidadeParcelas)

      this.ultimoPedido.formaPagamento[0].parcelas.map((parcela: Parcelas) => {
        this.parcelas.push(parcela);
      })

      const parcelaArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      parcelaArray.clear()
      this.parcelas.forEach(parcela => {
        parcela.dataPagamento = parcela.dataPagamento.split("T")[0]
        parcela.dataVencimento = parcela.dataVencimento.split("T")[0]
        parcela.statusPagamento = 0

        const novoGrupo = new UntypedFormGroup({});
        Object.keys(parcela).forEach(key => {
          novoGrupo.addControl(key, new UntypedFormControl(parcela[key]));
        });
        parcelaArray.push(novoGrupo);
      });
    }
    this.isUltimoPedido = true;
  }
  isAprovadoDiretor: any = false;

  findPedidoByCodigo() {
    this.pedidoService.getPedidoById(this.idPedido).subscribe(
      (pedido: any) => {
        this.isAprovadoDiretor = pedido.diretorAprovacao
        this.preencheListaUsuario()
        this.usuarioService.getById(pedido.formaPagamento[0].terceiro.id).subscribe(
          (terceiro: any) => {
            this.meuPedidoForm.get('nome')?.setValue(terceiro.nome);
            if (terceiro.cpf) {
              this.meuPedidoForm.get('cpf')?.setValue(terceiro.cpf);
              this.meuPedidoForm.get('contaCnpj')?.setValue(false);
            } else {
              this.meuPedidoForm.get('cnpj')?.setValue(terceiro.cnpj);
              this.meuPedidoForm.get('contaCnpj')?.setValue(true);
            }
            this.meuPedidoForm.get('TerceiroID')?.setValue(terceiro.id);
          }
        )

        this.contaService.getListContasPorIdUsuario(pedido.usuario.id).subscribe(
          (data: any[]) => {
            this.listaContasUsuario = data
            const contaSelecionada = this.listaContasUsuario.find(conta => conta.id === pedido.formaPagamento[0].contaBancaria ? pedido.formaPagamento[0].contaBancaria.id : pedido.formaPagamento[0].contaBancariaTerceiro.id)?.id
            this.formaPagamentoForm.get('idContaBancaria')?.setValue(contaSelecionada)
            this.atualizarDadosBancariosInput()
          }
        )


        this.formaPagamentoForm.get('tipoPagamento')?.setValue(pedido.formaPagamento[0].tipoPagamento)
        this.pedidoService.getAnexoByIdPedido(pedido.id).subscribe(
          (data: any[]) => {
            this.arquivosBase64 = data;
            this.arquivosBase64.map(arquivo => {
              arquivo.arquivo = this.base64toFile(arquivo.base64, arquivo.descricao)
            })
            this.filesDisplay = `${this.arquivosBase64.length}/${this.limiteArquivos}`
          }
        )
        const formatador = new FormatadorData();
        this.formaPagamentoForm.get('dataPagamento')?.setValue(formatador.formatarData(pedido.formaPagamento[0].parcelas[0].dataPagamento))
        this.formaPagamentoForm.get('dataVencimento')?.setValue(formatador.formatarData(pedido.formaPagamento[0].parcelas[0].dataVencimento))

        // this.formaPagamentoForm.get('valorTotal')?.setValue(pedido.formaPagamento[0].valorTotal)
        let valorTotal = pedido.formaPagamento[0].valorTotal.toString();
        const partes = valorTotal.split('.');
        const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let parteDecimal = partes[1] || '00';
        parteDecimal = parteDecimal.padEnd(2, '0');
        valorTotal = parteInteira + ',' + parteDecimal;
        this.formaPagamentoForm.get('valorTotal')?.setValue(valorTotal)

        this.formaPagamentoForm.get('descricao')?.setValue(pedido.descricao)
        this.preencheListaCentros(pedido.formaPagamento[0].centroDeCusto.id)
        this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(pedido.formaPagamento[0].centroDeCusto.id)

        if (pedido.formaPagamento[0].parcelas.length > 1) {
          this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
          this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)

          pedido.formaPagamento[0].parcelas.map((parcela: Parcelas) => {
            this.parcelas.push(parcela);
          })
        }

        this.pedidoService.getListObservacaoPorPedidoId(pedido.id).subscribe(
          (obs: any) => {
            this.listaObservacoes = obs
          }
        )
      }
    )
  }

  base64toFile(base64: string, filename: string): File {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: 'application/pdf' }); // Altere o tipo MIME conforme necessário
  }


  preencheListaUsuario() {
    this.usuarioService.getListaUsuarios().subscribe(
      (data: any[]) => {
        this.listaUsuario = data
      }
    )
  }

  preencheListaCentros(id: number) {
    this.centroCustoService.getById(id).subscribe(
      (data: CentroDeCusto) => {
        this.listaCentroCusto.push(data);
      }
    )
  }
  getCurrentDate(): void {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (formattedDate) {
      this.pedidoPagamento.dataPagamento = formattedDate;
      this.pedidoPagamento.dataVencimento = formattedDate
      this.formaPagamentoForm.get('dataPagamento')?.setValue(formattedDate);
      this.formaPagamentoForm.get('dataVencimento')?.setValue(formattedDate);
    } else {
      console.error('Erro ao formatar a data.');
    }
  }

  preencheQtdParcelas() {
    for (let i = 2; i <= 18; i++) {
      this.quantidadeMaximaParcela.push(i);
    }
  }

  onSubmit() {
    if (this.meuPedidoForm.valid) {
      this.isSubmitting = true;

      const userData: any = this.meuPedidoForm.value;
      console.log(userData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 3000);
    }
  }

  voltar() {
    if (this.isRelatorio) {
      this.router.navigate(['/administracao/relatorio-pedido'], { state: { relatorio: 'funcionario' } });
    } else {
      this.router.navigate(['/pedido/funcionario-consultar']);
    }

  }
  validationSave() {
    this.isSubmitting = true;
    // if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
    //   const parcelas = parseFloat(this.parcelas.reduce((total, parcela) => total + parcela.valorParcela, 0).toFixed(2));
    //   const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value)

    //   if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
    //     if (this.parcelas.length <= 0) {
    //       this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
    //       this.isSubmitting = false;
    //       return;
    //     }
    //   }
    //   if (valorTotal !== parcelas) {
    //     this.toastr.warning('O valor total das parcelas deve ser igual ao valor total do pedido', 'Atenção');
    //     this.isSubmitting = false;
    //     return;
    //   }
    // }

    if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
      // const parcelas = this.parcelas.reduce((total, parcela) => {
      //   const valorParcelaString = parcela.valorParcela.toString().replace(/\./g, '').replace(',', '.');
      //   return total + parseFloat(valorParcelaString);
      // }, 0);
      const parcelas = this.parcelas.map(parcela => {
        const valor = parcela.valorParcela;
        if (typeof valor === 'string') {
          return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
        } else if (typeof valor === 'number') {
          return valor;
        }
        // Caso não seja nem string nem número, você pode decidir o que fazer
        return 0; // ou lançar um erro, ou outra lógica de fallback
      });
      const somaParcelas = parcelas.reduce((total, valor) => total + valor, 0);

      const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
      const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));
      if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
        if (this.parcelas.length <= 0) {
          this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
          this.isSubmitting = false;
          return;
        }
      }
      if (valorTotal.toFixed(2) != somaParcelas.toFixed(2)) {
        this.toastr.warning('O valor total das parcelas deve ser igual ao valor total do pedido', 'Atenção');
        this.isSubmitting = false;
        return;
      }
      const formatador = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      // if(this.isUltimoPedido){
      //   const parcelaArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      //   parcelaArray.clear()
      //   this.parcelas.forEach(parcela => {
      //   parcela.valorParcela = formatador.format(parcela.valorParcela)

      //     const novoGrupo = new UntypedFormGroup({});
      //     Object.keys(parcela).forEach(key => {
      //       novoGrupo.addControl(key, new UntypedFormControl(parcela[key]));
      //     });
      //     parcelaArray.push(novoGrupo);
      //   });
      // }
    }

    const dataVencimento = this.datePipe.transform(this.formaPagamentoForm.get('dataVencimento')?.value, 'dd/MM/yyyy');
    const dataPagamento = this.datePipe.transform(this.formaPagamentoForm.get('dataPagamento')?.value, 'dd/MM/yyyy');
    const today = new Date();
    const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (dataPagamento) {
      const [day, month, year] = dataPagamento.split('/');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

      if (date < formattedDate) {
        this.toastr.warning('A data de pagamento não pode ser anterior à data atual', 'Atenção');
        this.isSubmitting = false;
        return;
      }
    }

    if (dataPagamento && dataVencimento) {
      if (dataPagamento > dataVencimento) {
        this.toastr.warning('A data de pagamento não pode ser maior que a data de vencimento', 'Atenção');
        this.isSubmitting = false;
        return;
      }
    }

    if (dataVencimento) {
      const [day, month, year] = dataVencimento.split('/');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      const limiteDias = 5;

      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + limiteDias);

      if (date < formattedDate) {
        this.toastr.warning('A data de vencimento não pode ser anterior à data atual', 'Atenção');
        this.isSubmitting = false;
        return;
      }

      if (date < dataLimite) {
        this.mensagemConfirmacao = 'Pedido em atraso! A data de vencimento não pode ser menor que ' + limiteDias + ' dias a partir de hoje, CONFIRMA o envio do pedido?'
        this.openDialogConfirmacao()
      } else {
        this.enviarDados()
      }
    }
  }

  mensagemConfirmacao: string = ""
  openDialogConfirmacao(): void {
    const dialogRef = this.dialog.open(DialogConfirmacaoComponent, {
      data: { mensagemConfirmacao: this.mensagemConfirmacao }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enviarDados()
      } else {
        this.isSubmitting = false
        return
      }
    });
  }

  enviarDados() {
    if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
      const listaParcelas = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;


      if (listaParcelas.length > 0) {
        this.aplicarIdZeroNasParcelas()

        if (this.isUltimoPedido) {
          let parcelas = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
          const parcela = parcelas.at(0);
          let valorTotal = parcela.value.valorParcela;
          if (typeof valorTotal != 'string') {
            this.converterValorParcelasEmString()
          }
        }
        this.retirarPontosDaParcela()
      }
    } else {
      const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      if (listaParcelasArray) {
        listaParcelasArray.clear();
      }
      this.adicionarUmaParcela()
      this.aplicarIdZeroNasParcelas()
      this.retirarPontosDaParcela()
    }

    if (this.formaPagamentoForm.get('tipoPagamento')?.value == 1 && this.arquivosBase64.length <= 0) {
      this.toastr.warning('Pagamentos em boleto exigem pelo menos um anexo.', 'Atenção')
      this.isSubmitting = false
      return
    }

    this.meuPedidoForm.get('valorTotalPedido')?.setValue(this.formaPagamentoForm.get('valorTotal')?.value.trim())
    this.formaPagamentoForm.get('valorTotal')?.setValue(0)

    this.salvar();
  }
  converterValorParcelasEmString() {
    let parcelas = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
    for (let i = 0; i < parcelas.length; i++) {
      const parcela = parcelas.at(i);
      let valorTotal = parcela.value.valorParcela;

      // Converte o número para string com duas casas decimais
      let valorStr = valorTotal.toFixed(2).toString();

      // Divide a parte inteira e a parte decimal
      const partes = valorStr.split('.');

      // Formata a parte inteira com pontos como separadores de milhar
      const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // A parte decimal já está formatada com duas casas decimais
      const parteDecimal = partes[1];

      // Junta a parte inteira e a parte decimal com vírgula
      valorTotal = parteInteira + ',' + parteDecimal;

      // Atualiza o valor da parcela com a string formatada
      parcela.patchValue({ id: 0, valorParcela: valorTotal.trim() });
    }
  }

  dataVencimentoValidation: Date = new Date()
  isDateParcelaInvalid: boolean = false;
  rolarParaSecaoDestino() {
    const elementoDestino = document.querySelector('#tipoPagamento');
    if (elementoDestino) {
      elementoDestino.scrollIntoView({ behavior: 'smooth' });
    }
  }

  salvar() {

    this.pedidoService.criarPedido(this.meuPedidoForm.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.success('Pedido enviado com sucesso', 'Sucesso');
        this.isSubmitting = false;
        this.router.navigate(['/pedido/usuario-consultar']);
      }
    )
  }

  cpfCnpjRequiredValidator(): { [key: string]: boolean } | null {
    const cpfControl = this.meuPedidoForm.get('cpf')?.value;
    const cnpjControl = this.meuPedidoForm.get('cnpj')?.value;

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
    this.meuPedidoForm.get('cpf')?.setValue('')
    this.meuPedidoForm.get('cnpj')?.setValue('')
  }

  retorno: string = ""
  validaFormaPagamento() {
    // if (!this.formaPagamentoForm.get('valorTotal')?.value) {
    //   this.toastr.warning('Informe o valor total do pedido primeiro','Atenção')
    // }


    if (this.pedidoPagamento.formaPagamento == "Parcelado") {
      this.pgtoParcelado = true;
    } else {
      this.pgtoParcelado = false;
    }
    // if (this.formaPagamentoForm.get('tipoPagamento')?.value == 1) {
    //   this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(0)
    // } else {
    //   this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(undefined)
    //   this.formaPagamentoForm.get('conta')?.setValue('');
    //   this.formaPagamentoForm.get('agencia')?.setValue('');
    //   this.formaPagamentoForm.get('pix')?.setValue('');
    // }

    if (this.formaPagamentoForm.get('tipoPagamento')?.value == 1) {
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(false);
      this.formaPagamentoForm.get('pedidoParcelado')?.disable()
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(false);
      this.formaPagamentoForm.get('idContaBancaria')?.setValue(0)
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(false)
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(false)
      this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(1)
      const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      if (listaParcelasArray) {
        listaParcelasArray.clear();
      }
      //this.adicionarUmaParcela()

    } else {
      this.formaPagamentoForm.get('idContaBancaria')?.setValue(undefined)
      this.formaPagamentoForm.get('conta')?.setValue('');
      this.formaPagamentoForm.get('agencia')?.setValue('');
      this.formaPagamentoForm.get('pix')?.setValue('');
      this.formaPagamentoForm.get('pedidoParcelado')?.enable();
    }
  }
  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;

    this.limparCpfCnpj();
  }
  adicionarUmaParcela() {
    this.parcelaForm.get('dataPagamento')?.setValue(this.formaPagamentoForm.get('dataPagamento')?.value)
    this.parcelaForm.get('dataVencimento')?.setValue(this.formaPagamentoForm.get('dataVencimento')?.value)
    this.parcelaForm.get('valorParcela')?.setValue(this.formaPagamentoForm.get('valorTotal')?.value.toString().trim())
    this.parcelaForm.get('parcelaReferencia')?.setValue(1)
    this.parcelaForm.get('quantidadeParcelas')?.setValue(1)
    const parcelaArrqay = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    parcelaArrqay.push(this.parcelaForm);
  }

  preencheDadosBancariosUsuario(id: number) {
    this.contaService.getListContasPorIdUsuario(id).subscribe(
      (data: ContaUsuario[]) => {
        this.listaContasUsuario = data;
      }
    )
  }

  changeContaBancaria() {
    // if(this.listaContasUsuario && this.listaContasUsuario.length <= 0){
    // this.adicionarConta()
    // }else{
    this.atualizarDadosBancariosInput()
    // }
  }

  atualizarDadosBancariosInput() {
    const idConta = this.formaPagamentoForm.get('idContaBancaria')?.value;
    if (idConta > 0) {
      this.contaService.getContaPorIdUsuario(idConta).subscribe(
        (data: any) => {
          this.formaPagamentoForm.get('conta')?.setValue(data.conta);
          this.formaPagamentoForm.get('agencia')?.setValue(data.agencia);
          this.formaPagamentoForm.get('pix')?.setValue(data.chavePix);
          this.formaPagamentoForm.get('tipoConta')?.setValue(this.mapeamentoEnumService.mapearTipoContaDescricao(data.tipoConta));
        }
      )
    }

  }

  desabilitarInputs() {
    this.formaPagamentoForm.get('conta')?.disable();
    this.formaPagamentoForm.get('agencia')?.disable();
    this.formaPagamentoForm.get('pix')?.disable();
    this.formaPagamentoForm.get('tipoConta')?.disable();
    this.meuPedidoForm.get('nome')?.disable();
    this.meuPedidoForm.get('cpf')?.disable();
    this.meuPedidoForm.get('cnpj')?.disable();
  }
  onFileSelected(event: any): void {
    this.toastr.clear();

    const file = event.target.files[0];

    if (!this.isFileTypeAllowed(file)) {
      this.toastr.warning('Tipo de arquivo não permitido.', 'Atenção');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('O arquivo é muito grande. O tamanho máximo permitido é 5MB.', 'Atenção');
      return;
    }

    if (this.numFilesAttached >= this.limiteArquivos) {
      this.toastr.warning(`Limite de ${this.limiteArquivos} arquivos atingido.`, 'Atenção');
      return;
    }

    const novoArquivo: Arquivo = {
      id: this.numFilesAttached + 1,
      descricao: file.name,
      tipoArquivo: file.name.split('.').pop(),
      arquivo: file,
      base64: ""
    };
    this.converterParaBase64(novoArquivo);
    (this.meuPedidoForm.controls.anexo as UntypedFormArray).push(new UntypedFormControl(novoArquivo));
    this.dataSourceFile.data = [...this.dataSourceFile.data, novoArquivo];
    this.numFilesAttached++;
    this.updateFilesDisplay();
    this.listaArquivo = this.dataSourceFile.data;
  }

  converterParaBase64(arquivo: Arquivo) {
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      arquivo.base64 = this.retornaBase64Formatado(base64String)
    };
    this.arquivosBase64.push(arquivo)
    reader.readAsDataURL(arquivo.arquivo);
  }

  retornaBase64Formatado(base64String: string): string {
    if (base64String.startsWith('data:image/jpeg;base64,')) {
      base64String = base64String.replace(/^data:image\/jpeg;base64,/, '');
    }
    if (base64String.startsWith('data:image/png;base64,')) {
      base64String = base64String.replace(/^data:image\/png;base64,/, '');
    }
    if (base64String.startsWith('data:application/pdf;base64,')) {
      base64String = base64String.replace(/^data:application\/pdf;base64,/, '');
    }
    return base64String;
  }

  removeFile(arquivo: Arquivo): void {
    this.dataSourceFile.data = this.dataSourceFile.data.filter(a => a !== arquivo);
    this.arquivosBase64 = this.arquivosBase64.filter(a => a !== arquivo)
    const anexoArray = this.meuPedidoForm.controls.anexo as UntypedFormArray;
    const index = anexoArray.controls.findIndex(control => control.value === arquivo);
    if (index !== -1) {
      anexoArray.removeAt(index);
    }
    this.numFilesAttached--;
    this.updateFilesDisplay();
    this.toastr.success('Arquivo deletado com sucesso.', 'Sucesso');
    console.log(this.arquivosBase64)
  }

  updateFilesDisplay(): void {
    this.filesDisplay = this.numFilesAttached > 0 ? `${this.numFilesAttached}/${this.limiteArquivos}` : '';
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedFileTypes = ['.pdf', '.jpg'];
    const fileType = '.' + file.name.split('.').pop();

    return allowedFileTypes.includes(fileType);
  }

  aplicarIdZeroNasParcelas() {
    let parcelas = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray
    for (let i = 0; i < parcelas.length; i++) {
      const parcela = parcelas.at(i);
      parcela.value.id = 0
    }
  }

  retirarPontosDaParcela() {
    let parcelas = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;

    for (let i = 0; i < parcelas.length; i++) {
      const parcela = parcelas.at(i);
      const valorParcela = parcela.get('valor')?.value;
      if (typeof valorParcela === 'string') {
        const valorFormatado = valorParcela.replace(/\./g, '').replace(',', '.');
        parcela.get('valor')?.setValue(parseFloat(valorFormatado));
      }
    }
  }

  gerarParcelas() {
    const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    if (listaParcelasArray) {
      listaParcelasArray.clear();
    }
    const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
    const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

    const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;
    const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
    const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;


    if (qtdParcelas == 0) {
      this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
      return;
    }

    this.formaPagamentoForm.get('exibirParcelas')?.setValue(true);

    if (valorTotal && qtdParcelas && dataPagamentoStr) {
      this.parcelas = [];
      let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00Z');
      let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00Z');

      // Calcula o valor das parcelas (sem centavos)
      const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
      const centavosRestantes = valorTotal % qtdParcelas;

      // for (let i = 0; i < qtdParcelas; i++) {
      //   const valorParcela = (i === 0) ? valorParcelaSemCentavos + centavosRestantes : valorParcelaSemCentavos;
      //   const parcela: Parcelas = {
      //     id: i + 1,
      //     parcelaReferencia: i + 1,
      //     dataVencimento: this.formatarData(dataVencimento),
      //     dataPagamento: this.formatarData(dataPagamento),
      //     valorParcela: parseFloat(valorParcela.toFixed(2)),
      //     statusPagamento: 0,
      //     quantidadeParcelas: qtdParcelas,
      //     exclusao: false,
      //   };
      //   this.parcelas.push(parcela);
      //   (this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray).push(new UntypedFormControl(parcela));

      //   dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
      //   dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);

      // }

      for (let i = 0; i < qtdParcelas; i++) {
        let valorParcela = valorParcelaSemCentavos;
        if (i === qtdParcelas - 1) {
          valorParcela += centavosRestantes;
        }


        const parcela: Parcelas = {
          id: i + 1,
          parcelaReferencia: i + 1,
          dataVencimento: this.formatarData(dataVencimento),
          dataPagamento: this.formatarData(dataPagamento),
          valorParcela: valorParcela.toFixed(2).toString(),
          statusPagamento: 0,
          quantidadeParcelas: qtdParcelas,
          exclusao: false,
        };

        this.parcelas.push(parcela);

        let valorTotal = parcela.valorParcela
        const partes = valorTotal.split('.');
        const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let parteDecimal = partes[1] || '00';
        parteDecimal = parteDecimal.padEnd(2, '0');
        valorTotal = parteInteira + ',' + parteDecimal;

        parcela.valorParcela = valorTotal;

        (this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray).push(new UntypedFormControl(parcela));

        dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
        dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
      }

      this.dataSource.data = [...this.parcelas];

    }
    this.isDateParcelaInvalid = false
  }

  formatarData(data: Date): string {
    const year = data.getUTCFullYear();
    const month = ('0' + (data.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + data.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  tooglePedidoParcelado(event: MatSlideToggleChange) {
    if (this.validarGeracaoDeParcela()) {
      const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      if (listaParcelasArray) {
        listaParcelasArray.clear();
      }
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(event.checked)
      this.parcelas = []
      this.dataSource.data = [...this.parcelas];
      this.formaPagamentoForm.get('rateio')?.disable()
      if (!event.checked) {
        this.formaPagamentoForm.get('exibirParcelas')?.setValue(false)
        this.formaPagamentoForm.get('rateio')?.enable()
        this.parcelas = []
        // this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(0)

        if (!this.formaPagamentoForm.get('pedidoParcelado')?.value) {
          this.parcelaForm.get('dataPagamento')?.setValue(this.formaPagamentoForm.get('dataPagamento')?.value)
          this.parcelaForm.get('dataVencimento')?.setValue(this.formaPagamentoForm.get('dataVencimento')?.value)
          this.parcelaForm.get('valorParcela')?.setValue(this.formaPagamentoForm.get('valorTotal')?.value)
          this.parcelaForm.get('parcelaReferencia')?.setValue(1)
          this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(1)

          const parcelaArrqay = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
          parcelaArrqay.push(this.parcelaForm);
        }
      }

    } else {
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(!event.checked)
      if (!event.checked) {
        this.formaPagamentoForm.get('exibirParcelas')?.setValue(false)
        this.formaPagamentoForm.get('rateio')?.enable()
      }
      this.toastr.warning('Informações de pagamento incompletas', 'Atenção');
      this.formaPagamentoForm.markAllAsTouched();
    }
  }
  validarGeracaoDeParcela(): boolean {
    const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value);
    const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;
    const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
    const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;
    const centroDeCusto = this.formaPagamentoForm.get('idCentroCusto')?.value;

    if (isNaN(valorTotal) || !dataPagamentoStr || !dataVencimentoStr) {
      return false;
    } else {
      return true;
    }

  }


  toogleRateio(event: MatSlideToggleChange) {
    this.formaPagamentoForm.get('pedidoParcelado')?.disable()
    if (!event.checked) {
      this.formaPagamentoForm.get('pedidoParcelado')?.enable()
      this.formaPagamentoForm.get('usuarioRateio')?.setValue('')
      this.rateio = []
      this.dataSourceRateio.data = [...this.rateio];
    }
  }

  openDialog(parcela: Parcelas): void {
    parcela.exclusao = false;
    const dialogRef = this.dialog.open(DialogEditParcelaDialogComponent, {
      data: { ...parcela },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualize a parcela no componente que abre o diálogo com as alterações
        this.atualizarParcela(result.id, result);
      }
    });
  }

  openDialogDelete(parcela: Parcelas): void {
    parcela.exclusao = true;
    const dialogRef = this.dialog.open(DialogEditParcelaDialogComponent, {
      width: '350px',
      data: { ...parcela },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarParcela(result.id, result);
      }
    });
  }

  openDialogRateio(rateio: Rateio): void {
    rateio.exclusao = false;
    const dialogRef = this.dialog.open(DialogEditRateioDialogComponent, {
      width: '350px',
      data: { ...rateio },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarRateio(result.id, result);
      }
    });
  }

  openDialogDeleteRateio(rateio: Rateio): void {
    rateio.exclusao = true;
    const dialogRef = this.dialog.open(DialogEditRateioDialogComponent, {
      width: '350px',
      data: { ...rateio },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atualizarRateio(result.id, result);
      }
    });
  }

  atualizarParcela(id: any, parcela: Parcelas) {
    // const index = this.parcelas.findIndex(objeto => objeto.id === id);
    // if (parcela.exclusao && parcela.id > 0) {
    //   this.deletarParcela(parcela.id)
    //   return;
    // }
    // if (index !== -1) {
    //   const listaParcelasArray = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
    //   const parcelaControl = listaParcelasArray.at(index);
    //   parcelaControl.patchValue(parcela);
    //   this.parcelas[index] = { ...parcela };
    //   this.dataSource.data = [...this.parcelas];
    // }

    const index = this.parcelas.findIndex(objeto => objeto.id === id);
    if (parcela.exclusao && parcela.id > 0) {
      this.deletarParcela(parcela.id)
      return;
    }
    if (index !== -1) {
      const listaParcelasArray = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
      const parcelaControl = listaParcelasArray.at(index);
      parcelaControl.patchValue(parcela);
      this.parcelas[index] = { ...parcela };
      if (index == 0) {
        const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
        const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));
        const novaPrimeiraParcela = parseFloat(parcela.valorParcela.replace(/\./g, '').replace(',', '.'));
        const valorRestante = valorTotal - novaPrimeiraParcela;
        const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;
        const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
        const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;

        // Remove as parcelas antigas da lista
        while (listaParcelasArray.length > 1) {
          listaParcelasArray.removeAt(1);
        }

        this.parcelas = [parcela];

        // Gera as novas parcelas
        if (qtdParcelas > 1) {
          this.gerarParcelasComValorTotal(valorRestante, qtdParcelas - 1, dataPagamentoStr, dataVencimentoStr);
        }
      }
    }
  }

  atualizarRateio(id: any, rateio: Rateio) {
    const index = this.rateio.findIndex(objeto => objeto.id === id);
    if (rateio.exclusao && rateio.id > 0) {
      this.deletarRateio(rateio.id)
      return;
    }
    if (index !== -1) {
      this.rateio[index] = { ...rateio };
      this.dataSourceRateio.data = [...this.rateio];
    }
    this.meuPedidoForm.get('usuarioRateio')?.setValue('')

  }

  deletarRateio(id: any) {
    const index = this.rateio.findIndex(objeto => objeto.id === id);

    if (index !== -1) {
      this.rateio.splice(index, 1);
      this.dataSourceRateio.data = [...this.rateio];
    }
  }

  deletarParcela(id: any) {
    const index = this.parcelas.findIndex(objeto => objeto.id === id);

    if (index !== -1) {
      const listaParcelasArray = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
      listaParcelasArray.removeAt(index);
      this.parcelas.splice(index, 1);
      this.dataSource.data = [...this.parcelas];
    }
  }

  calcularValorParcela(qtdParcelas: number): string {

    // const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value)

    // if (valorTotal && qtdParcelas) {
    //   const valorParcela = valorTotal / qtdParcelas;
    //   return `x R$${valorParcela.toFixed(0)}`;
    // }
    // return '';

    const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
    const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

    if (valorTotal && qtdParcelas) {
      const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
      const formattedValue = valorParcelaSemCentavos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `x ${formattedValue}`;
    }
    return '';
  }

  openNewWindow(arquivo: Arquivo): void {
    const fileType = arquivo.descricao.substring(arquivo.descricao.lastIndexOf('.') + 1);

    if (['jpeg', 'jpg'].includes(fileType.toLowerCase())) {
      const newTab = window.open();
      if (newTab) {
        const img = newTab.document.createElement('img');
        img.src = URL.createObjectURL(arquivo.arquivo);
        newTab.document.body.appendChild(img);
      } else {
        alert('O bloqueador de pop-ups está ativado. Por favor, permita pop-ups para este site e tente novamente.');
      }
    } else if (fileType.toLowerCase() === 'pdf') {
      const blob = new Blob([arquivo.arquivo], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
    }
  }

  // selecionaTipoPedidoTerceiro(event: any) {
  //   if (this.listaTiposTerceiro.includes(event.value)) {
  //     if (event.value == this.listaTiposTerceiro[0]) {
  //       this.telaFucnionario = true;
  //       this.telaFornecedor = false;
  //     }
  //     if (event.value == this.listaTiposTerceiro[1]) {
  //       this.telaFucnionario = false;
  //       this.telaFornecedor = true;
  //     }
  //   }
  // }

  addPersonToList(selectedPerson: any): void {
    const updatedData = [...this.dataSourceRateio.data, selectedPerson];
    this.dataSourceRateio.data = updatedData;
  }

  addPessoaListaRateio() {
    if (this.meuPedidoForm.get('valorTotalPagamento')?.value <= 0) {
      this.toastr.warning('Preencha o valor total do pagamento primeiro', 'Atenção');
      this.meuPedidoForm.get('usuarioRateio')?.setValue('')
      return;
    }
    const userId = this.meuPedidoForm.get('usuarioRateio')?.value;
    const usuario = this.listaUsuarios.find(item => item.id === userId);

    if (usuario) {
      const isAlreadyInRateio = this.dataSourceRateio.data.some(item => item.id === usuario.id);

      if (isAlreadyInRateio) {
        this.toastr.warning('Pessoa já está na lista de rateio.', 'Atenção');
      } else {
        const valorUsuarioRateio = this.meuPedidoForm.get('valorTotalPagamento')?.value / 2
        this.meuPedidoForm.get('valorTotalPagamento')?.setValue(valorUsuarioRateio)
        const rateio: Rateio = {
          id: usuario.id,
          usuario: usuario,
          valor: valorUsuarioRateio,
          exclusao: false,
        };

        const updatedData = [...this.dataSourceRateio.data, rateio];
        this.dataSourceRateio.data = updatedData;
        this.rateio = updatedData;
      }
    } else {
      this.toastr.warning('Usuário não encontrado', 'Atenção');

    }
    this.meuPedidoForm.get('usuarioRateio')?.setValue('')

  }

  ngAfterViewInit() {
  }

  formatacaoMoedaBRL() {
    const value = this.formaPagamentoForm.get('valorTotal')?.value
    const formater = value.toLocaleString("pt-BR", {
      currency: "BRL",
      style: "currency",
      minimumFractionDigits: 2
    })

    return this.formaPagamentoForm.get('valorTotal')?.setValue(formater);
  }

  adicionarConta() {
    this.openDialogAddContaUsuario();
  }

  openDialogAddContaUsuario(): void {
    const idUsuario = this.meuPedidoForm.get('UsuarioID')?.value;
    const dialogRef = this.dialog.open(DialogAddContaUsuarioComponent, {
      data: { idUsuario },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaService.getListContasPorIdUsuario(idUsuario).subscribe(
          (data: any[]) => {
            this.listaContasUsuario = data
            this.formaPagamentoForm.get('idContaBancaria')?.setValue(this.listaContasUsuario[0].id)
            this.atualizarDadosBancariosInput()
          }
        )
        return;
      }
    });
  }

  popularUsuarioInput(userId: number) {

    this.habilitarCamposDepoisDeSelecionarUsuario()
    const usuario: any | undefined = this.listaUsuario.find(f => f.id === userId);

    if (usuario) {
      this.meuPedidoForm.get('UsuarioID')?.setValue(usuario.id)
      if (usuario.cpf) {
        this.meuPedidoForm.get('cpf')?.setValue(usuario.cpf);
        this.meuPedidoForm.get('contaCnpj')?.setValue(false);
      } else {
        this.meuPedidoForm.get('cnpj')?.setValue(usuario.cnpj);
        this.meuPedidoForm.get('contaCnpj')?.setValue(true);
      }
    }
    this.preencheDadosBancariosUsuario(usuario!.id)
    this.formaPagamentoForm.get('conta')?.setValue('');
    this.formaPagamentoForm.get('agencia')?.setValue('');
    this.formaPagamentoForm.get('pix')?.setValue('');
    this.formaPagamentoForm.get('tipoConta')?.setValue('');
    if (usuario!.idCentroCusto > 0) {
      this.preencheListaCentros(usuario!.idCentroCusto)
      this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(usuario!.idCentroCusto)
    }

    this.retornaUltimoPedido(usuario?.id)
  }

  limparTela() {
    //this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(0)
    this.formaPagamentoForm.get('descricao')?.setValue(undefined)
    this.formaPagamentoForm.get('pedidoParcelado')?.setValue(0)
    this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(0)
    this.formaPagamentoForm.get('rateio')?.setValue(0)
    this.formaPagamentoForm.get('valorTotal')?.setValue(undefined)
    this.formaPagamentoForm.get('exibirParcelas')?.setValue(false)

    const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    if (listaParcelasArray) {
      listaParcelasArray.clear();
    }
    this.arquivosBase64 = []
    this.parcelas = []
  }

  mascaraMoeda(event: any): void {
    const onlyDigits: string = event.target.value
      .split("")
      .filter((s: string) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat: string = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    event.target.value = this.maskCurrency(parseFloat(digitsFloat));
    this.formaPagamentoForm.get('valorTotal')?.setValue(event.target.value.replace('R$', ''))
  }

  maskCurrency(valor: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor);
  }

  formatCurrency(value: string): string {
    if (!value) return '';
    const numberValue = parseFloat(value.replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
  }

  formatarParcela(parcela: any): string {
    if (typeof parcela === 'number') {
      return parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
      return parcela;
    }
  }

  private gerarParcelasComValorTotal(valorTotal: number, qtdParcelas: number, dataPagamentoStr: string, dataVencimentoStr: string) {
    let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00Z');
    let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00Z');

    // Calcula o valor das parcelas (sem centavos)
    const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
    const centavosRestantes = valorTotal - (valorParcelaSemCentavos * qtdParcelas);

    for (let i = 0; i < qtdParcelas; i++) {
      let valorParcela = valorParcelaSemCentavos;
      if (i === qtdParcelas - 1) {
        valorParcela += centavosRestantes;
      }

      if (i == 0) {
        dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
        dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
      }
      const parcela: any = {
        id: 0,
        parcelaReferencia: i + 2,
        dataVencimento: this.formatarData(dataVencimento),
        dataPagamento: this.formatarData(dataPagamento),
        valorParcela: valorParcela.toFixed(2).toString(),
        statusPagamento: 0,
        quantidadeParcelas: qtdParcelas + 1,
        exclusao: false,
      };

      this.parcelas.push(parcela);

      let valorTotal = parcela.valorParcela
      const partes = valorTotal.split('.');
      const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      let parteDecimal = partes[1] || '00';
      parteDecimal = parteDecimal.padEnd(2, '0');
      valorTotal = parteInteira + ',' + parteDecimal;

      parcela.valorParcela = valorTotal;

      (this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray).push(new UntypedFormControl(parcela));

      dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
      dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
    }

    this.dataSource.data = [...this.parcelas];
  }

  desabilitarCamposAntesDeSelecionarUsuario() {
    this.formaPagamentoForm.get('valorTotal')?.disable()
    this.formaPagamentoForm.get('dataPagamento')?.disable()
    this.formaPagamentoForm.get('dataVencimento')?.disable()
    this.formaPagamentoForm.get('tipoPagamento')?.disable()
    this.formaPagamentoForm.get('descricao')?.disable()
    this.formaPagamentoForm.get('idCentroDeCusto')?.disable()
    this.formaPagamentoForm.get('pedidoParcelado')?.disable()
    this.formaPagamentoForm.get('idContaBancaria')?.disable()
  }

  habilitarCamposDepoisDeSelecionarUsuario() {
    this.formaPagamentoForm.get('valorTotal')?.enable()
    this.formaPagamentoForm.get('dataPagamento')?.enable()
    this.formaPagamentoForm.get('dataVencimento')?.enable()
    this.formaPagamentoForm.get('tipoPagamento')?.enable()
    this.formaPagamentoForm.get('descricao')?.enable()
    this.formaPagamentoForm.get('idCentroDeCusto')?.enable()
    this.formaPagamentoForm.get('pedidoParcelado')?.enable()
    this.formaPagamentoForm.get('idContaBancaria')?.enable()
  }
}
