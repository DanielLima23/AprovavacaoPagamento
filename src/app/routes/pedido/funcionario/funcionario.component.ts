import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-pedido-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss']
})
export class PedidoFuncionarioComponent implements OnInit {


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
  listaContasTerceiro: ContaTerceiro[] = []
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
  listaTiposTerceiro: string[] = []
  telaFucnionario: boolean = false;
  telaFornecedor: boolean = false;
  listaCentroCusto: CentroDeCusto[] = []
  listaTipoRateio: { id: number; descricao: string }[] = [];
  listaUsuarios: Usuario[] = []
  arquivosBase64: Arquivo[] = [];
  listaFuncionario: any[] = []
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
    private terceiroService: TerceiroService
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

    id: new UntypedFormControl(0),
    TipoPedido: new UntypedFormControl(1),
    TerceiroID: new UntypedFormControl(undefined),
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
    // idContaBancaria: new UntypedFormControl(undefined, Validators.required),
    idContaBancariaTerceiro: new UntypedFormControl(undefined, Validators.required),
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
    tipoTerceiro: new UntypedFormControl(this.listaTiposTerceiro[0]),
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

  addParcela(parcela: Parcelas) {
    const parcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    const parcelaGroup = new UntypedFormGroup({
      id: new UntypedFormControl(parcela.id),
      parcelaReferencia: new UntypedFormControl(parcela.parcelaReferencia),
      quantidadeParcelas: new UntypedFormControl(parcela.quantidadeParcelas),
      valorParcela: new UntypedFormControl(parcela.valorParcela),
      dataPagamento: new UntypedFormControl(parcela.dataPagamento),
      dataVencimento: new UntypedFormControl(parcela.dataVencimento)
    });
    parcelasArray.push(parcelaGroup);
  }

  removerParcela(indexFormaPagamento: number, indexParcela: number) {
    ((this.meuPedidoForm.get('listaFormaPagamento') as UntypedFormArray).at(indexFormaPagamento).get('listaParcelas') as UntypedFormArray).removeAt(indexParcela);
  }

  setDescricaoNaFormaPagamentoForm() {
    this.meuPedidoForm.get('descricao')?.setValue(this.formaPagamentoForm.get('descricao')?.value)
  }

  @Input() idPedido: number = 0;
  isRelatorio: any
  isRelatorioPagamento: any

  ngOnInit() {
    this.preencheListaFuncionario()
    this.preencheQtdParcelas()

    this.idPedido = history.state.id;
    this.isRelatorio = history.state.relatorio
    this.isRelatorioPagamento = history.state.relatorioPagamento
    if (this.idPedido == null || this.idPedido == undefined) {
      this.idPedido = this.isIdPedidoPorParcela
    }

    if (this.idPedido > 0) {
      this.formaPagamentoForm.disable();
      this.meuPedidoForm.disable()
      this.findPedidoByCodigo(this.idPedido)
      return;
    }
    this.desabilitarCamposAntesDeSelecionarTerceiro()

    this.idPedido = 0
    this.desabilitarInputs()
    this.getCurrentDate();
    this.listaTiposTerceiro = TipoTerceiroSelect.tiposTerceiro.map(terceiro => terceiro.descricao);
    this.listaTipoRateio = TipoRateioSelect.tipoRateio
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
    // this.preencheListaFuncionario()
    // this.terceiroService.getTerceiroById(this.ultimoPedido.formaPagamento[0].terceiro.id).subscribe(
    //   (terceiro: any) => {
    //     this.meuPedidoForm.get('nome')?.setValue(terceiro.nome);
    //     if (terceiro.cpf) {
    //       this.meuPedidoForm.get('cpf')?.setValue(terceiro.cpf);
    //       this.meuPedidoForm.get('contaCnpj')?.setValue(false);
    //     } else {
    //       this.meuPedidoForm.get('cnpj')?.setValue(terceiro.cnpj);
    //       this.meuPedidoForm.get('contaCnpj')?.setValue(true);
    //     }
    //     this.meuPedidoForm.get('TerceiroID')?.setValue(terceiro.id);
    //   }
    // )

    // this.contaService.getListContasPorIdTerceiro(this.ultimoPedido.usuario.id).subscribe(
    //   (data: any[]) => {
    //     this.listaContasTerceiro = data
    //     const contaSelecionada = this.listaContasTerceiro.find(conta => conta.id === this.ultimoPedido.formaPagamento[0].contaBancaria ? this.ultimoPedido.formaPagamento[0].contaBancaria.id : this.ultimoPedido.formaPagamento[0].contaBancariaTerceiro.id)?.id
    //     this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(contaSelecionada)
    //     this.atualizarDadosBancariosInput()
    //   }
    // )


    // this.formaPagamentoForm.get('tipoPagamento')?.setValue(this.ultimoPedido.formaPagamento[0].tipoPagamento)
    // // this.pedidoService.getAnexoByIdPedido(this.ultimoPedido.id).subscribe(
    // //   (data: any[]) => {
    // //     this.arquivosBase64 = data;
    // //     this.arquivosBase64.map(arquivo => {
    // //       arquivo.arquivo = this.base64toFile(arquivo.base64, arquivo.descricao)
    // //     })
    // //     this.filesDisplay = `${this.arquivosBase64.length}/${this.limiteArquivos}`
    // //   }
    // // )
    // const formatador = new FormatadorData();
    // const hoje: Date = new Date();
    // const dataAtual: string = hoje.toISOString().slice(0, 10);
    // this.formaPagamentoForm.get('dataPagamento')?.setValue(dataAtual)
    // this.formaPagamentoForm.get('dataVencimento')?.setValue(dataAtual)
    // // this.formaPagamentoForm.get('valorTotal')?.setValue(this.ultimoPedido.formaPagamento[0].valorTotal)
    // let valorTotal = this.ultimoPedido.formaPagamento[0].valorTotal.toFixed(2).toString();
    // const partes = valorTotal.split('.');
    // const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // let parteDecimal = partes[1] || '00';
    // parteDecimal = parteDecimal.padEnd(2, '0');
    // valorTotal = parteInteira + ',' + parteDecimal;
    // this.formaPagamentoForm.get('valorTotal')?.setValue(valorTotal)

    // this.formaPagamentoForm.get('descricao')?.setValue(this.ultimoPedido.descricao)
    // //this.preencheListaCentros(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)
    // //this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)

    // // if (this.ultimoPedido.formaPagamento[0].parcelas.length > 1) {
    // //   this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
    // //   this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
    // //   this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(this.ultimoPedido.formaPagamento[0].quantidadeParcelas)
    // //   this.gerarParcelas()
    // // }

    // if (this.ultimoPedido.formaPagamento[0].parcelas.length > 1) {
    //   this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
    //   this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
    //   this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(this.ultimoPedido.formaPagamento[0].quantidadeParcelas)

    //   this.ultimoPedido.formaPagamento[0].parcelas.map((parcela: Parcelas) => {
    //     this.parcelas.push(parcela);
    //   })

    //   const parcelaArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    //   parcelaArray.clear()
    //   // this.parcelas.forEach(parcela => {
    //   //   parcela.dataPagamento = parcela.dataPagamento.split("T")[0]
    //   //   parcela.dataVencimento = parcela.dataVencimento.split("T")[0]
    //   //   parcela.statusPagamento = 0

    //   //   const novoGrupo = new UntypedFormGroup({});
    //   //   Object.keys(parcela).forEach(key => {
    //   //     novoGrupo.addControl(key, new UntypedFormControl(parcela[key]));
    //   //   });
    //   //   parcelaArray.push(novoGrupo);
    //   // });
    //   this.gerarParcelas()
    // }
    this.isUltimoPedido = true;

    this.findPedidoByCodigo(this.ultimoPedido.id)

  }

  isAprovadoDiretor: any = false;
  quemSolicitou: string = ''
  dataDaSolicitacao: any

  findPedidoByCodigo(idPedido: number) {
    this.pedidoService.getPedidoById(idPedido).subscribe(
      (pedido: any) => {
        this.isAprovadoDiretor = pedido.diretorAprovacao
        this.quemSolicitou = pedido.usuarioSolicitou.nome
        this.dataDaSolicitacao = pedido.dataCadastro
        if (this.isPedidoRecusadoMetodo(pedido)) {
          this.isPedidoRecusado = true
          this.formaPagamentoForm.enable()

          // this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
          this.desabilitarInputs()

        } else {
          this.isPedidoRecusado = false
        }
        // this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
        this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(pedido.formaPagamento[0].quantidadeParcelas)
        this.preencheListaFuncionario()
        this.terceiroService.getTerceiroById(pedido.formaPagamento[0].terceiro.id).subscribe(
          (terceiro: any) => {
            this.meuPedidoForm.get('nome')?.setValue(terceiro.nome);
            if (terceiro.cpf) {
              this.meuPedidoForm.get('cpf')?.setValue(terceiro.cpf);
              this.meuPedidoForm.get('contaCnpj')?.setValue(false);
            } else {
              this.meuPedidoForm.get('cnpj')?.setValue(terceiro.cnpj);
              this.meuPedidoForm.get('contaCnpj')?.setValue(true);
            }
            if (this.isUltimoPedido) {
              this.meuPedidoForm.get('id')?.setValue(0);
            } else {
              this.meuPedidoForm.get('id')?.setValue(pedido.id);
            }
            this.meuPedidoForm.get('TerceiroID')?.setValue(terceiro.id);

          }
        )

        this.contaService.getListContasPorIdTerceiro(pedido.usuario.id).subscribe(
          (data: any[]) => {
            this.listaContasTerceiro = data
            const contaSelecionada = this.listaContasTerceiro.find(conta => conta.id === pedido.formaPagamento[0].contaBancaria ? pedido.formaPagamento[0].contaBancaria.id : pedido.formaPagamento[0].contaBancariaTerceiro.id)?.id
            this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(contaSelecionada)
            this.atualizarDadosBancariosInput()
          }
        )


        this.formaPagamentoForm.get('tipoPagamento')?.setValue(pedido.formaPagamento[0].tipoPagamento)



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

        // if (pedido.formaPagamento[0].parcelas.length > 1) {
        //   this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
        //   this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
        //   this.limparParcelas()
        //   pedido.formaPagamento[0].parcelas.map((parcela: Parcelas) => {
        //     this.parcelas.push(parcela);
        //     this.addParcela(parcela)
        //   })
        // }

        if (pedido.formaPagamento[0].parcelas.length > 1) {
          this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
          this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
        }

        this.limparParcelas()
        if (!this.isUltimoPedido) {
          pedido.formaPagamento[0].parcelas.map((parcela: Parcelas) => {
            this.parcelas.push(parcela);
            this.addParcela(parcela)
          })

          this.pedidoService.getAnexoByIdPedido(pedido.id).subscribe(
            (data: any[]) => {
              this.arquivosBase64 = data;
              this.arquivosBase64.map(arquivo => {
                arquivo.arquivo = this.base64toFile(arquivo.base64, arquivo.descricao)
              })
              this.updateFilesDisplay()
            }
          )
          const formatador = new FormatadorData();
          this.formaPagamentoForm.get('dataPagamento')?.setValue(formatador.formatarData(pedido.formaPagamento[0].parcelas[0].dataPagamento))
          this.formaPagamentoForm.get('dataVencimento')?.setValue(formatador.formatarData(pedido.formaPagamento[0].parcelas[0].dataVencimento))
          this.formaPagamentoForm.get('pedidoParcelado')?.disable()

        } else {
          const hoje: Date = new Date();
          const dataAtual: string = hoje.toISOString().slice(0, 10);
          this.formaPagamentoForm.get('dataPagamento')?.setValue(dataAtual)
          this.formaPagamentoForm.get('dataVencimento')?.setValue(dataAtual)
          this.gerarParcelas()
        }
        this.formaPagamentoForm.get('idCentroDeCusto')?.disable()

        if (this.isPedidoRecusado) {
          const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;

          listaParcelasArray.controls.forEach(control => {
            const id = control.get('id')?.value;
            if (id !== undefined && id !== null) {
              this.ids.push(id);
            }
          });
        }
        this.parcelasBackup = this.parcelas
        this.pedidoService.getListObservacaoPorPedidoId(pedido.id).subscribe(
          (obs: any) => {
            this.listaObservacoes = obs
          }
        )
      }
    )
  }
  parcelasBackup: any[] = []

  aprovacoes: any[] = []
  isPedidoRecusado: boolean = false
  isPedidoRecusadoMetodo(pedido: any): boolean {
    this.aprovacoes.push(pedido.responsavelAprovacao)
    this.aprovacoes.push(pedido.financeiroAprovacao)
    this.aprovacoes.push(pedido.ceoAprovacao)
    this.aprovacoes.push(pedido.diretorAprovacao)

    if (this.aprovacoes.includes(2)) {
      return true
    } else {
      return false
    }
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


  preencheListaFuncionario() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFuncionario = data.filter((funcionario: any) => funcionario.tipoTerceiro === 0);
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
    if (this.isRelatorioPagamento) {
      this.router.navigate(['/administracao/relatorio-pagamento'], { state: { relatorioPagamento: 'funcionario' } });

    } else if (this.isRelatorio) {
      this.router.navigate(['/administracao/relatorio-pedido'], { state: { relatorio: 'funcionario' } });
    } else {
      this.router.navigate(['/pedido/funcionario-consultar']);
    }

  }
  validationSave() {
    this.isSubmitting = true;

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
        return 0;
      });
      const somaParcelas = parcelas.reduce((total, valor) => total + valor, 0);

      this.valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
      const valorTotal = parseFloat(this.valorInput.replace(/\./g, '').replace(',', '.'));
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
      if (!this.isPedidoRecusado) {
        this.limparParcelas()
      }
      this.adicionarUmaParcela()
      this.retirarPontosDaParcela()
    }
    if (!this.isPedidoRecusado) {
      this.aplicarIdZeroNasParcelas()
    }

    if (this.formaPagamentoForm.get('tipoPagamento')?.value == 1 && this.arquivosBase64.length <= 0) {
      this.toastr.warning('Pagamentos em boleto exigem pelo menos um anexo.', 'Atenção')
      this.isSubmitting = false
      return
    }

    this.meuPedidoForm.get('valorTotalPedido')?.setValue(this.formaPagamentoForm.get('valorTotal')?.value.trim())
    this.formaPagamentoForm.get('valorTotal')?.setValue(0)

    let pedidoId = this.meuPedidoForm.get('id')?.value
    if (pedidoId <= 0) {
      this.salvar();
    } else {
      this.converterParcelasEmString()
      this.atualizarPedido()
    }
  }
  atualizarPedido() {
    this.pedidoService.atualizarPedido(this.meuPedidoForm.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.success('Pedido enviado com sucesso', 'Sucesso');
        this.isSubmitting = false;
        this.router.navigate(['/pedido/funcionario-consultar']);
      }
    )
  }

  converterParcelasEmString() {
    let parcelas = this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray;
    const parcela = parcelas.at(0);
    let valorTotal = parcela.value.valorParcela;
    if (typeof valorTotal != 'string') {
      this.converterValorParcelasEmString()
    }
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
      parcela.patchValue({ valorParcela: valorTotal.trim() });
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

    this.pedidoService.criarPedidoTerceiro(this.meuPedidoForm.getRawValue()).subscribe(
      (data: any) => {
        this.toastr.success('Pedido enviado com sucesso', 'Sucesso');
        this.isSubmitting = false;
        this.router.navigate(['/pedido/funcionario-consultar']);
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
    if (this.pedidoPagamento.formaPagamento == "Parcelado") {
      this.pgtoParcelado = true;
    } else {
      this.pgtoParcelado = false;
    }

    if (this.formaPagamentoForm.get('tipoPagamento')?.value == 1) {
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(false);
      this.formaPagamentoForm.get('pedidoParcelado')?.disable()
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(false);
      this.formaPagamentoForm.get('idContaBancaria')?.setValue(0)
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(false)
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(false)
      this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(1)
      // const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      // if (listaParcelasArray) {
      //   listaParcelasArray.clear();
      // }
      // this.adicionarUmaParcela()
      //this.limparParcelas()

    } else {
      this.formaPagamentoForm.get('idContaBancaria')?.setValue(undefined)
      this.formaPagamentoForm.get('conta')?.setValue('');
      this.formaPagamentoForm.get('agencia')?.setValue('');
      this.formaPagamentoForm.get('pix')?.setValue('');
      // if (this.isPedidoRecusado) {
      this.formaPagamentoForm.get('pedidoParcelado')?.enable()
      // } else {
      //   this.formaPagamentoForm.get('pedidoParcelado')?.value == true ? this.formaPagamentoForm.get('pedidoParcelado')?.enable() : this.formaPagamentoForm.get('pedidoParcelado')?.disable();
      // }
    }
  }
  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;

    this.limparCpfCnpj();
  }
  adicionarUmaParcela() {
    let parcela: Parcelas = new Parcelas()
    const parcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    const parcelaControl = parcelasArray.at(0);
    let id = parcelaControl?.value.id ?? 0
    parcela.id = id
    parcela.dataPagamento = this.formaPagamentoForm.get('dataPagamento')?.value
    parcela.dataVencimento = this.formaPagamentoForm.get('dataVencimento')?.value
    parcela.valorParcela = this.formaPagamentoForm.get('valorTotal')?.value.toString().trim()
    parcela.parcelaReferencia = 1
    parcela.quantidadeParcelas = 1
    this.limparParcelas()
    this.addParcela(parcela)
  }

  preencheDadosBancariosTerceiro(id: number) {
    this.contaService.getListContasPorIdTerceiro(id).subscribe(
      (data: ContaTerceiro[]) => {
        this.listaContasTerceiro = data;
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
    const idConta = this.formaPagamentoForm.get('idContaBancariaTerceiro')?.value;
    if (idConta > 0) {
      this.contaService.getContaPorIdTerceiro(idConta).subscribe(
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

    // if (this.numFilesAttached >= this.limiteArquivos) {
    //   this.toastr.warning(`Limite de ${this.limiteArquivos} arquivos atingido.`, 'Atenção');
    //   return;
    // }

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
    this.filesDisplay = this.numFilesAttached > 0 ? `${this.numFilesAttached}` : '';
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedFileTypes = ['.pdf', '.jpg'];
    const fileType = '.' + file.name.split('.').pop();

    return allowedFileTypes.includes(fileType);
  }

  aplicarIdZeroNasParcelas() {
    const parcelas = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    for (let i = 0; i < parcelas.length; i++) {
      const parcela = parcelas.at(i);
      parcela.value.id = 0
    }
  }

  retirarPontosDaParcela() {
    const parcelas = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;

    for (let i = 0; i < parcelas.length; i++) {
      const parcela = parcelas.at(i);
      const valorParcela = parcela.get('valor')?.value;
      if (typeof valorParcela === 'string') {
        const valorFormatado = valorParcela.replace(/\./g, '').replace(',', '.');
        parcela.get('valor')?.setValue(parseFloat(valorFormatado));
      }
    }
  }


  ids: number[] = [];

  limparParcelas() {
    const parcelaArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    parcelaArray.clear()
  }


  // gerarParcelas() {
  //   const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
  //   const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

  //   const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;
  //   const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
  //   const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;
  //   this.formaPagamentoForm.get('exibirParcelas')?.setValue(true);

  //   if (qtdParcelas == 0) {
  //     this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
  //     return;
  //   }

  //   const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
  //   this.limparParcelas();

  //   if (valorTotal && qtdParcelas && dataPagamentoStr) {
  //     const idsExistentes = this.ids || [];
  //     const novasParcelas: Parcelas[] = [];
  //     let dataPagamento = new Date(`${dataPagamentoStr}T00:00:00`);
  //     let dataVencimento = new Date(`${dataVencimentoStr}T00:00:00`);

  //     const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
  //     const centavosRestantes = valorTotal - (valorParcelaSemCentavos * qtdParcelas);

  //     for (let i = 0; i < qtdParcelas; i++) {
  //       let valorParcela = valorParcelaSemCentavos;
  //       if (i === qtdParcelas - 1) {
  //         valorParcela += centavosRestantes;
  //       }

  //       let parcela: Parcelas;
  //       if (i < idsExistentes.length) {
  //         parcela = this.parcelasBackup.find(p => p.id === idsExistentes[i]);
  //         if (parcela) {
  //           this.atualizarParcelaGeracao(parcela, i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
  //         } else {
  //           parcela = this.criarParcela(i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
  //         }
  //       } else {
  //         parcela = this.criarParcela(i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
  //       }

  //       //parcela.valorParcela = this.formatarValor(parcela.valorParcela);
  //       novasParcelas.push(parcela);
  //       this.addParcela(parcela);

  //       dataPagamento = this.incrementarMes(dataPagamento);
  //       dataVencimento = this.incrementarMes(dataVencimento);
  //     }

  //     this.parcelas = novasParcelas;
  //     this.dataSource.data = [...this.parcelas];
  //   }

  //   this.isDateParcelaInvalid = false;
  // }

  // atualizarParcelaGeracao(parcela: Parcelas, indice: number, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number) {
  //   parcela.parcelaReferencia = indice + 1;
  //   parcela.dataVencimento = this.formatarData(dataVencimento);
  //   parcela.dataPagamento = this.formatarData(dataPagamento);
  //   parcela.valorParcela = valorParcela.toFixed(2).toString();
  //   parcela.quantidadeParcelas = qtdParcelas;
  // }

  // criarParcela(indice: number, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number): Parcelas {
  //   return {
  //     id: 0,
  //     parcelaReferencia: indice + 1,
  //     dataVencimento: this.formatarData(dataVencimento),
  //     dataPagamento: this.formatarData(dataPagamento),
  //     valorParcela: valorParcela.toFixed(2).toString().replace('.',','),
  //     statusPagamento: 0,
  //     quantidadeParcelas: qtdParcelas,
  //     exclusao: false,
  //   };
  // }

  // formatarValor(valor: string): string {
  //   const partes = valor.split('.');
  //   const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //   let parteDecimal = partes[1] || '00';
  //   parteDecimal = parteDecimal.padEnd(2, '0');
  //   return parteInteira + ',' + parteDecimal;
  // }

  // incrementarMes(data: Date): Date {
  //   data.setUTCMonth(data.getUTCMonth() + 1);
  //   return data;
  // }

  // private gerarParcelasComValorTotalSemIdParcela(valorTotal: number, qtdParcelas: number, dataPagamentoStr: string, dataVencimentoStr: string) {
  //   let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00');
  //   let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00');

  //   // Calcula o valor das parcelas (sem centavos)
  //   const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
  //   const centavosRestantes = valorTotal - (valorParcelaSemCentavos * qtdParcelas);

  //   for (let i = 0; i < qtdParcelas; i++) {
  //     let valorParcela = valorParcelaSemCentavos;
  //     if (i === qtdParcelas - 1) {
  //       valorParcela += centavosRestantes;
  //     }

  //     if (i == 0) {
  //       dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
  //       dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
  //     }
  //     const parcela: any = {
  //       id: 0,
  //       parcelaReferencia: i + 2,
  //       dataVencimento: this.formatarData(dataVencimento),
  //       dataPagamento: this.formatarData(dataPagamento),
  //       valorParcela: valorParcela.toFixed(2).toString(),
  //       statusPagamento: 0,
  //       quantidadeParcelas: qtdParcelas + 1,
  //       exclusao: false,
  //     };

  //     this.parcelas.push(parcela);

  //     let valorTotal = parcela.valorParcela
  //     const partes = valorTotal.split('.');
  //     const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  //     let parteDecimal = partes[1] || '00';
  //     parteDecimal = parteDecimal.padEnd(2, '0');
  //     valorTotal = parteInteira + ',' + parteDecimal;

  //     parcela.valorParcela = valorTotal;

  //     (this.formaPagamentoForm.controls.listaParcelas as UntypedFormArray).push(new UntypedFormControl(parcela));

  //     dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
  //     dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
  //   }

  //   this.dataSource.data = [...this.parcelas];
  // }


  // private gerarParcelasComValorTotal(valorTotal: number, qtdParcelas: number, dataPagamentoStr: string, dataVencimentoStr: string) {
  //   const idsExistentes = this.ids || [];
  //   let dataPagamento = new Date(`${dataPagamentoStr}T00:00:00`);
  //   let dataVencimento = new Date(`${dataVencimentoStr}T00:00:00`);

  //   // Calcula o valor das parcelas (sem centavos)
  //   const valorParcelaSemCentavos = Math.floor(valorTotal / (qtdParcelas - 1));
  //   const centavosRestantes = valorTotal - (valorParcelaSemCentavos * (qtdParcelas - 1));

  //   if (this.ids.length <= 0) {
  //     this.gerarParcelasComValorTotalSemIdParcela(valorTotal, qtdParcelas - 1, dataPagamentoStr, dataVencimentoStr)
  //     return
  //   }
  //   for (let i = 0; i < qtdParcelas; i++) {
  //     let valorParcela: number = valorParcelaSemCentavos;
  //     if (i === qtdParcelas - 1) {
  //       valorParcela += parseFloat(centavosRestantes.toFixed(2));
  //     }
  //     let parcela: any;
  //     parcela = this.parcelasBackup.find(p => p.id === idsExistentes[i]);
  //     if (parcela) {
  //       if (parcela.parcelaReferencia == 2) {
  //         dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
  //         dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
  //       }
  //       if (parcela.parcelaReferencia != 1) {
  //         if (i < idsExistentes.length) {
  //           if (parcela) {
  //             parcela = this.atualizarParcelaGeracaoComValor(parcela, dataPagamento, dataVencimento, valorParcela, parcela.quantidadeParcelas);
  //             dataPagamento = this.incrementarMes(dataPagamento);
  //             dataVencimento = this.incrementarMes(dataVencimento);
  //             this.parcelas.push(parcela);
  //             this.addParcela(parcela);
  //           }
  //         } else {
  //           parcela = this.criarParcela(i + 1, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
  //           this.parcelas.push(parcela);
  //           dataPagamento = this.incrementarMes(dataPagamento);
  //           dataVencimento = this.incrementarMes(dataVencimento);
  //           this.addParcela(parcela);
  //         }
  //       }
  //     } else {
  //       parcela = this.criarParcela((i-1) + 1, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
  //       this.parcelas.push(parcela);
  //       dataPagamento = this.incrementarMes(dataPagamento);
  //       dataVencimento = this.incrementarMes(dataVencimento);
  //       this.addParcela(parcela);
  //     }
  //   }
  // }



  // atualizarParcelaGeracaoComValor(parcela: Parcelas, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number): any {
  //   parcela.parcelaReferencia = parcela.parcelaReferencia
  //   parcela.dataVencimento = this.formatarData(dataVencimento);
  //   parcela.dataPagamento = this.formatarData(dataPagamento);
  //   if (typeof valorParcela != 'string') {
  //     parcela.valorParcela = this.formatarValor(valorParcela.toFixed(2).toString());
  //   }
  //   parcela.quantidadeParcelas = qtdParcelas;
  //   return parcela
  // }


  // formatarData(data: Date): string {
  //   const dia = String(data.getDate()).padStart(2, '0');
  //   const mes = String(data.getMonth() + 1).padStart(2, '0');
  //   const ano = data.getFullYear();
  //   return `${ano}-${mes}-${dia}`;
  // }

  public formatarValorBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();
  }

  // Função para converter valor BRL string para número
  public converterValorBRLParaNumero(valor: string): number {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  }

  // Método principal para gerar parcelas
  gerarParcelas() {
    const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
    const valorTotal = this.converterValorBRLParaNumero(valorInput);

    const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;
    const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
    const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;
    this.formaPagamentoForm.get('exibirParcelas')?.setValue(true);

    if (qtdParcelas == 0) {
      this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
      return;
    }

    this.limparParcelas();

    if (valorTotal && qtdParcelas && dataPagamentoStr) {
      const idsExistentes = this.ids || [];
      const novasParcelas: Parcelas[] = [];
      let dataPagamento = new Date(`${dataPagamentoStr}T00:00:00`);
      let dataVencimento = new Date(`${dataVencimentoStr}T00:00:00`);

      const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
      const centavosRestantes = valorTotal - (valorParcelaSemCentavos * qtdParcelas);

      for (let i = 0; i < qtdParcelas; i++) {
        let valorParcela = valorParcelaSemCentavos;
        if (i === qtdParcelas - 1) {
          valorParcela += centavosRestantes;
        }

        let parcela: Parcelas;
        if (i < idsExistentes.length) {
          parcela = this.parcelasBackup.find(p => p.id === idsExistentes[i]);
          if (parcela) {
            this.atualizarParcelaGeracao(parcela, i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
          } else {
            parcela = this.criarParcela(i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
          }
        } else {
          parcela = this.criarParcela(i, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
        }

        novasParcelas.push(parcela);
        this.addParcela(parcela);

        dataPagamento = this.incrementarMes(dataPagamento);
        dataVencimento = this.incrementarMes(dataVencimento);
      }

      this.parcelas = novasParcelas;
      this.dataSource.data = [...this.parcelas];
    }

    this.isDateParcelaInvalid = false;
  }

  atualizarParcelaGeracao(parcela: Parcelas, indice: number, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number) {
    parcela.parcelaReferencia = indice + 1;
    parcela.dataVencimento = this.formatarData(dataVencimento);
    parcela.dataPagamento = this.formatarData(dataPagamento);
    parcela.valorParcela = this.formatarValorBRL(valorParcela);
    parcela.quantidadeParcelas = qtdParcelas;
  }

  criarParcela(indice: number, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number): Parcelas {
    return {
      id: 0,
      parcelaReferencia: indice + 1,
      dataVencimento: this.formatarData(dataVencimento),
      dataPagamento: this.formatarData(dataPagamento),
      valorParcela: this.formatarValorBRL(valorParcela),
      statusPagamento: 0,
      quantidadeParcelas: qtdParcelas,
      exclusao: false,
    };
  }

  incrementarMes(data: Date): Date {
    data.setUTCMonth(data.getUTCMonth() + 1);
    return data;
  }

  private gerarParcelasComValorTotalSemIdParcela(valorTotal: number, qtdParcelas: number, dataPagamentoStr: string, dataVencimentoStr: string) {
    let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00');
    let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00');

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

      const parcela: Parcelas = {
        id: 0,
        parcelaReferencia: i + 2,
        dataVencimento: this.formatarData(dataVencimento),
        dataPagamento: this.formatarData(dataPagamento),
        valorParcela: this.formatarValorBRL(valorParcela),
        statusPagamento: 0,
        quantidadeParcelas: qtdParcelas + 1,
        exclusao: false,
      };

      this.parcelas.push(parcela);
      this.addParcela(parcela);

      dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
      dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
    }

    this.dataSource.data = [...this.parcelas];
  }

  private gerarParcelasComValorTotal(valorTotal: number, qtdParcelas: number, dataPagamentoStr: string, dataVencimentoStr: string) {
    const idsExistentes = this.ids || [];
    let dataPagamento = new Date(`${dataPagamentoStr}T00:00:00`);
    let dataVencimento = new Date(`${dataVencimentoStr}T00:00:00`);

    const valorParcelaSemCentavos = Math.floor(valorTotal / (qtdParcelas - 1));
    const centavosRestantes = valorTotal - (valorParcelaSemCentavos * (qtdParcelas - 1));

    if (this.ids[0] === 0 || this.ids.length === 0) {
      this.gerarParcelasComValorTotalSemIdParcela(valorTotal, qtdParcelas - 1, dataPagamentoStr, dataVencimentoStr)
      return;
    }

    for (let i = 0; i < qtdParcelas; i++) {
      let valorParcela = valorParcelaSemCentavos;
      if (i === qtdParcelas - 1) {
        valorParcela += centavosRestantes;
      }

      let parcela: Parcelas;
      parcela = this.parcelasBackup.find(p => p.id === idsExistentes[i]);
      if (parcela) {
        if (parcela.parcelaReferencia == 2) {
          dataPagamento = this.incrementarMes(dataPagamento);
          dataVencimento = this.incrementarMes(dataVencimento);
        }
        if (parcela.parcelaReferencia != 1) {
          if (i < idsExistentes.length) {
            parcela = this.atualizarParcelaGeracaoComValor(parcela, dataPagamento, dataVencimento, valorParcela, parcela.quantidadeParcelas);
            dataPagamento = this.incrementarMes(dataPagamento);
            dataVencimento = this.incrementarMes(dataVencimento);
            this.parcelas.push(parcela);
            this.addParcela(parcela);
          } else {
            parcela = this.criarParcela(i + 1, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
            this.parcelas.push(parcela);
            dataPagamento = this.incrementarMes(dataPagamento);
            dataVencimento = this.incrementarMes(dataVencimento);
            this.addParcela(parcela);
          }
        }
      } else {
        dataPagamento = this.incrementarMes(dataPagamento);
        dataVencimento = this.incrementarMes(dataVencimento);
        parcela = this.criarParcela((i - 1) + 1, dataPagamento, dataVencimento, valorParcela, qtdParcelas);
        this.parcelas.push(parcela);
        this.addParcela(parcela);
      }
    }
  }

  atualizarParcelaGeracaoComValor(parcela: Parcelas, dataPagamento: Date, dataVencimento: Date, valorParcela: number, qtdParcelas: number): Parcelas {
    parcela.parcelaReferencia = parcela.parcelaReferencia;
    parcela.dataVencimento = this.formatarData(dataVencimento);
    parcela.dataPagamento = this.formatarData(dataPagamento);
    parcela.valorParcela = this.formatarValorBRL(valorParcela);
    parcela.quantidadeParcelas = qtdParcelas;
    return parcela;
  }

  formatarData(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
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
    if (parcela.dataPagamento.includes('T')) {
      parcela.dataPagamento = parcela.dataPagamento.slice(0, 10);
    }
    if (parcela.dataVencimento.includes('T')) {
      parcela.dataVencimento = parcela.dataVencimento.slice(0, 10);
    }
    if (typeof parcela.valorParcela === 'number') {
      parcela.valorParcela = this.setValorParcelaString(parcela.valorParcela);
    }
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

  setValorParcelaString(valor: any): string {
    let valorTotal = valor.toFixed(2).toString();
    const partes = valorTotal.split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let parteDecimal = partes[1] || '00';
    parteDecimal = parteDecimal.padEnd(2, '0');
    valorTotal = parteInteira + ',' + parteDecimal;
    return valorTotal
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
        // Obtém o valor total do campo de formulário e converte para número
        const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
        const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

        // Converte o valor da parcela para número
        const novaPrimeiraParcela = parseFloat(parcela.valorParcela.replace(/\./g, '').replace(',', '.'));

        // Calcula o valor restante
        const valorRestante = valorTotal - novaPrimeiraParcela;

        // Obtém a quantidade de parcelas do campo de formulário
        const qtdParcelas = this.formaPagamentoForm.get('quantidadeParcelas')?.value;

        // Obtém as datas de pagamento e vencimento do campo de formulário
        const dataPagamentoStr = this.formaPagamentoForm.get('dataPagamento')?.value;
        const dataVencimentoStr = this.formaPagamentoForm.get('dataVencimento')?.value;

        // Limpa o array de parcelas, mantendo apenas a primeira parcela
        while (listaParcelasArray.length > 1) {
          listaParcelasArray.removeAt(1);
        }

        // Define a nova lista de parcelas com a primeira parcela
        this.parcelas = [parcela];

        // Gera as parcelas restantes, se houver mais de uma
        if (qtdParcelas > 1) {
          this.gerarParcelasComValorTotal(valorRestante, qtdParcelas, dataPagamentoStr, dataVencimentoStr);
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

    const valorInput = this.formaPagamentoForm.get('valorTotal')?.value;
    if (valorInput) {
      const valorTotal = parseFloat(valorInput.replace(/\./g, '').replace(',', '.'));

      if (valorTotal && qtdParcelas) {
        const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
        const formattedValue = valorParcelaSemCentavos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `x ${formattedValue}`;
      }
    }
    return '';
  }

  valorInput: string = ""


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

  selecionaTipoPedidoTerceiro(event: any) {
    if (this.listaTiposTerceiro.includes(event.value)) {
      if (event.value == this.listaTiposTerceiro[0]) {
        this.telaFucnionario = true;
        this.telaFornecedor = false;
      }
      if (event.value == this.listaTiposTerceiro[1]) {
        this.telaFucnionario = false;
        this.telaFornecedor = true;
      }
    }
  }

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
    const idTerceiro = this.meuPedidoForm.get('TerceiroID')?.value;
    const dialogRef = this.dialog.open(DialogAddContaFuncionarioComponent, {
      data: { idTerceiro },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaService.getListContasPorIdTerceiro(idTerceiro).subscribe(
          (data: any[]) => {
            this.listaContasTerceiro = data
            this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(this.listaContasTerceiro[0].id)
            this.atualizarDadosBancariosInput()
          }
        )
        return;
      }
    });
  }

  popularFuncionarioInput(userId: number) {

    this.habilitarCamposDepoisDeSelecionarTerceiro()
    const funcionario: Terceiro | undefined = this.listaFuncionario.find(f => f.id === userId);

    if (funcionario) {
      this.meuPedidoForm.get('TerceiroID')?.setValue(funcionario.id)
      if (funcionario.cpf) {
        this.meuPedidoForm.get('cpf')?.setValue(funcionario.cpf);
        this.meuPedidoForm.get('contaCnpj')?.setValue(false);
      } else {
        this.meuPedidoForm.get('cnpj')?.setValue(funcionario.cnpj);
        this.meuPedidoForm.get('contaCnpj')?.setValue(true);
      }
    }
    this.preencheDadosBancariosTerceiro(funcionario!.id)
    this.formaPagamentoForm.get('conta')?.setValue('');
    this.formaPagamentoForm.get('agencia')?.setValue('');
    this.formaPagamentoForm.get('pix')?.setValue('');
    this.formaPagamentoForm.get('tipoConta')?.setValue('');
    if (funcionario!.idCentroCusto > 0) {
      this.preencheListaCentros(funcionario!.idCentroCusto)
      this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(funcionario!.idCentroCusto)
    }

    this.retornaUltimoPedido(funcionario?.id)
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


  desabilitarCamposAntesDeSelecionarTerceiro() {
    this.formaPagamentoForm.get('valorTotal')?.disable()
    this.formaPagamentoForm.get('dataPagamento')?.disable()
    this.formaPagamentoForm.get('dataVencimento')?.disable()
    this.formaPagamentoForm.get('tipoPagamento')?.disable()
    this.formaPagamentoForm.get('descricao')?.disable()
    this.formaPagamentoForm.get('idCentroDeCusto')?.disable()
    this.formaPagamentoForm.get('pedidoParcelado')?.disable()
    this.formaPagamentoForm.get('idContaBancariaTerceiro')?.disable()
  }

  habilitarCamposDepoisDeSelecionarTerceiro() {
    this.formaPagamentoForm.get('valorTotal')?.enable()
    this.formaPagamentoForm.get('dataPagamento')?.enable()
    this.formaPagamentoForm.get('dataVencimento')?.enable()
    this.formaPagamentoForm.get('tipoPagamento')?.enable()
    this.formaPagamentoForm.get('descricao')?.enable()
    this.formaPagamentoForm.get('idCentroDeCusto')?.enable()
    this.formaPagamentoForm.get('pedidoParcelado')?.enable()
    this.formaPagamentoForm.get('idContaBancariaTerceiro')?.enable()
  }

}


