import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo } from 'app/models/auxiliar/arquivo';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Parcelas } from 'app/models/parcelas';
import { PedidoPagamento } from 'app/models/pedidoPagamento';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { DialogEditParcelaDialogComponent } from 'app/routes/dialog/edit-parcela-dialog/edit-parcela-dialog.component';
import { TerceiroService } from 'app/routes/administracao/terceiros/terceiro.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormatadorData } from 'app/models/auxiliar/formatador-date';
import { Rateio } from 'app/models/rateio';
import { DialogAddContaFuncionarioComponent } from 'app/routes/dialog/add-conta-funcionario/add-conta-funcionario.component';
import { DialogEditRateioDialogComponent } from 'app/routes/dialog/edit-rateio-dialog/edit-rateio-dialog.component';
import { TipoRateioSelect } from 'app/util/classes/select-tipo-rateio';
import { TipoTerceiroSelect } from 'app/util/classes/select-tipo-terceiro';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedido-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class PedidoFornecedorComponent implements OnInit {

  // onSubmit() {
  //   throw new Error('Method not implemented.');
  // }
  // ultimoPedido: any

  // displayedColumns: string[] = ['data', 'valor', 'actions'];
  // displayedColumnsFiles: string[] = ['file', 'actions'];
  // isSubmitting = false;
  // userForm: FormGroup;
  // contaCnpj: boolean = false;
  // pedidoPagamento: PedidoPagamento = new PedidoPagamento();
  // listaBancos: string[] = [];
  // listaFormaPagamento: string[] = [];
  // listaParcelas: number[] = []
  // pgtoParcelado: boolean = false;
  // currentDate: string = "";
  // idFornecedor: number = 0;
  // listaContasFornecedor: ContaTerceiro[] = []
  // parcelas: Parcelas[] = [];
  // numFilesAttached: number = 0;
  // fileNames: string[] = [];
  // limiteArquivos: number = 10;
  // filesDisplay: string = '';
  // dataSource = new MatTableDataSource<Parcelas>(this.parcelas);
  // dataSourceFile = new MatTableDataSource<Arquivo>();
  // listaArquivo: Arquivo[] = []
  // listaFornecedor: Terceiro[] = []
  // listaCentroCusto: CentroDeCusto[]=[]


  // constructor(private formBuilder: FormBuilder,
  //   private router: Router,
  //   private datePipe: DatePipe,
  //   private contaService: ContaBancariaService,
  //   private mapeamentoEnumService: MapeamentoEnumService,
  //   public dialog: MatDialog,
  //   private toastr: ToastrService,
  //   private terceiroService: TerceiroService,
  //   private centroCustoService: CentroDeCustoService,
  // ) {
  //   this.userForm = this.formBuilder.group({
  //     fornecedor: [''],
  //     cpf: [''],
  //     cnpj: [''],
  //     bancoCadastrado: ['', Validators.required],
  //     formaPagamento: ['', Validators.required],
  //     dataPagamento: ['', Validators.required],
  //     dataVencimento: ['', Validators.required],
  //     valorTotalPagamento: ['', Validators.required],
  //     qtdParcelas: [''],
  //     descricaoPagamento: [''],
  //     contaCnpj: [''],
  //     pedidoParcelado: [false],
  //     gerarParcelas: [false],
  //     finalidade:[''],

  //     tipoConta: [''],
  //     agencia: [''],
  //     conta: [''],
  //     pix: [''],

  //     exibirParcelas: [false],
  //     centroCusto: ['',Validators.required],

  //   }, {
  //     validators: this.cpfCnpjRequiredValidator
  //   });
  // }

  // ngOnInit() {
  //   this.desabilitarInputs()
  //   this.getCurrentDate();
  //   this.preencheListaFornecedores()
  //   this.listaFormaPagamento = FormasPagamentoSelect.formasPagamento.map(forma => forma.descricao);
  //   this.preencheQtdParcelas()
  //   this.preencheListaCentros()

  // }


  // preencheListaCentros() {
  //   this.centroCustoService.getListaCentroDeCusto().subscribe(
  //     (data: CentroDeCusto[]) => {
  //       this.listaCentroCusto = data;
  //     }
  //   )
  // }

  // preencheQtdParcelas() {
  //   for (let i = 2; i <= 60; i++) {
  //     this.listaParcelas.push(i);
  //   }
  // }

  // preencheListaFornecedores() {
  //   this.terceiroService.getListaTerceiroPorCliente().subscribe(
  //     (data: Terceiro[]) => {
  //       this.listaFornecedor = data;
  //     }
  //   )
  // }
  // popularFornecedorInput(userId: number) {
  //   const fornecedor: Terceiro | undefined = this.listaFornecedor.find(f => f.id === userId);

  //   if (fornecedor) {
  //     if (fornecedor.cpf) {
  //       this.userForm.get('cpf')?.setValue(fornecedor.cpf);
  //       this.userForm.get('contaCnpj')?.setValue(false);
  //     } else {
  //       this.userForm.get('cnpj')?.setValue(fornecedor.cnpj);
  //       this.userForm.get('contaCnpj')?.setValue(true);
  //     }
  //   }
  //   this.userForm.get('finalidade')?.setValue(fornecedor?.finalidade);
  //   this.preencheListaContasTerceiro(fornecedor!.id)
  //   this.userForm.get('conta')?.setValue('');
  //   this.userForm.get('agencia')?.setValue('');
  //   this.userForm.get('pix')?.setValue('');
  //   this.userForm.get('tipoConta')?.setValue('');
  //   if(fornecedor!.idCentroCusto > 0){
  //     this.userForm.get('centroCusto')?.setValue(fornecedor!.idCentroCusto)
  //   }

  // }
  // preencheListaContasTerceiro(id: number) {
  //   this.contaService.getListContasPorIdTerceiro(id).subscribe(
  //     (data: ContaTerceiro[]) => {
  //       this.listaContasFornecedor = data;
  //     }
  //   )
  // }

  // getCurrentDate(): void {
  //   const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  //   if (formattedDate) {
  //     this.pedidoPagamento.dataPagamento = formattedDate;
  //     this.pedidoPagamento.dataVencimento = formattedDate
  //     this.userForm.get('dataPagamento')?.setValue(formattedDate);
  //     this.userForm.get('dataVencimento')?.setValue(formattedDate);
  //   } else {
  //     console.error('Erro ao formatar a data.');
  //   }
  // }

  // desabilitarInputs() {
  //   this.userForm.get('conta')?.disable();
  //   this.userForm.get('agencia')?.disable();
  //   this.userForm.get('pix')?.disable();
  //   this.userForm.get('tipoConta')?.disable();
  // }

  // cpfCnpjRequiredValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
  //   const cpfControl = formGroup.get('cpf');
  //   const cnpjControl = formGroup.get('cnpj');

  //   if (!cpfControl || !cnpjControl) {
  //     return null;
  //   }
  //   const cpf = cpfControl.value;
  //   const cnpj = cnpjControl.value;

  //   if (cpf || cnpj) {
  //     return null;
  //   }
  //   return { 'cpfCnpjRequired': true };
  // }

  // toggleCpfCnpj(event: MatSlideToggleChange) {
  //   this.contaCnpj = event.checked;

  //   this.limparCpfCnpj();
  // }

  // limparCpfCnpj() {
  //   this.userForm.get('cpf')?.setValue('')
  //   this.userForm.get('cnpj')?.setValue('')
  // }

  // atualizaDadosInput() {
  //   const dado = this.userForm.get('bancoCadastrado')?.value;
  //   this.contaService.getContaPorIdTerceiro(dado).subscribe(
  //     (data: ContaTerceiro) => {
  //       this.userForm.get('conta')?.setValue(data.conta);
  //       this.userForm.get('agencia')?.setValue(data.agencia);
  //       this.userForm.get('pix')?.setValue(data.chavePix);
  //       this.userForm.get('tipoConta')?.setValue(this.mapeamentoEnumService.mapearTipoContaDescricao(data.tipoConta));
  //     }
  //   )
  // }

  // tooglePedidoParcelado(event: MatSlideToggleChange) {
  //   this.userForm.get('pedidoParcelado')?.setValue(event.checked)
  //   this.userForm.get('qtdParcelas')?.setValue(0)
  //   this.parcelas = []
  //   this.dataSource.data = [...this.parcelas];
  //   if (!event.checked) {
  //     this.userForm.get('exibirParcelas')?.setValue(false)
  //   }
  // }

  // calcularValorParcela(qtdParcelas: number): string {
  //   const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));
  //   if (valorTotal && qtdParcelas) {
  //     const valorParcela = valorTotal / qtdParcelas;
  //     return `x R$${valorParcela.toFixed(0)}`;
  //   }
  //   return '';
  // }

  // gerarParcelas() {
  //   const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));
  //   const qtdParcelas = this.userForm.get('qtdParcelas')?.value;
  //   const dataPagamentoStr = this.userForm.get('dataPagamento')?.value;
  //   const dataVencimentoStr = this.userForm.get('dataVencimento')?.value;

  //   if (valorTotal == 0 || qtdParcelas == 0 || dataPagamentoStr == "") {
  //     return;
  //   }
  //   this.userForm.get('exibirParcelas')?.setValue(true);

  //   if (valorTotal && qtdParcelas && dataPagamentoStr) {
  //     this.parcelas = [];
  //     let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00Z');
  //     let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00Z');

  //     const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
  //     const centavosRestantes = valorTotal % qtdParcelas;

  //     for (let i = 0; i < qtdParcelas; i++) {
  //       const valorParcela = (i === 0) ? valorParcelaSemCentavos + centavosRestantes : valorParcelaSemCentavos;
  //       const parcela: Parcelas = {
  //         id: i + 1,
  //         parcelaReferencia: i + 1,
  //         dataVencimento: this.formatarData(dataPagamento),
  //         dataPagamento: this.formatarData(dataVencimento),
  //         valorParcela: parseFloat(valorParcela.toFixed(2)),
  //         statusPagamento: 0,
  //         quantidadeParcelas:0,
  //         exclusao: false,
  //       };
  //       this.parcelas.push(parcela);

  //       dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
  //       dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
  //     }

  //     this.dataSource.data = [...this.parcelas];
  //   }
  //   console.log(this.parcelas);
  // }


  // formatarData(data: Date): string {
  //   const year = data.getUTCFullYear();
  //   const month = ('0' + (data.getUTCMonth() + 1)).slice(-2);
  //   const day = ('0' + data.getUTCDate()).slice(-2);
  //   return `${year}-${month}-${day}`;
  // }

  // openDialog(parcela: Parcelas): void {
  //   parcela.exclusao = false;
  //   const dialogRef = this.dialog.open(DialogEditParcelaDialogComponent, {
  //     width: '350px',
  //     data: { ...parcela },
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.atualizarParcela(result.id, result);
  //     }
  //   });
  // }

  // openDialogDelete(parcela: Parcelas): void {
  //   parcela.exclusao = true;
  //   const dialogRef = this.dialog.open(DialogEditParcelaDialogComponent, {
  //     width: '350px',
  //     data: { ...parcela },
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.atualizarParcela(result.id, result);
  //     }
  //   });
  // }

  // atualizarParcela(id: any, parcela: Parcelas) {
  //   const index = this.parcelas.findIndex(objeto => objeto.id === id);
  //   if (parcela.exclusao && parcela.id > 0) {
  //     this.deletarParcela(parcela.id)
  //     return;
  //   }
  //   if (index !== -1) {
  //     this.parcelas[index] = { ...parcela };
  //     this.dataSource.data = [...this.parcelas];
  //   }
  // }

  // deletarParcela(id: any) {
  //   const index = this.parcelas.findIndex(objeto => objeto.id === id);

  //   if (index !== -1) {
  //     this.parcelas.splice(index, 1);
  //     this.dataSource.data = [...this.parcelas];
  //   }
  // }


  // openNewWindow(arquivo: Arquivo): void {
  //   const fileType = arquivo.descricao.substring(arquivo.descricao.lastIndexOf('.') + 1);

  //   if (['jpeg', 'jpg'].includes(fileType.toLowerCase())) {
  //     const newTab = window.open();
  //     if (newTab) {
  //       const img = newTab.document.createElement('img');
  //       img.src = URL.createObjectURL(arquivo.arquivo);
  //       newTab.document.body.appendChild(img);
  //     } else {
  //       alert('O bloqueador de pop-ups está ativado. Por favor, permita pop-ups para este site e tente novamente.');
  //     }
  //   } else if (fileType.toLowerCase() === 'pdf') {
  //     const blob = new Blob([arquivo.arquivo], { type: 'application/pdf' });
  //     const fileUrl = URL.createObjectURL(blob);
  //     window.open(fileUrl, '_blank');
  //   }
  // }

  // onFileSelected(event: any): void {
  //   this.toastr.clear();

  //   const file = event.target.files[0];

  //   if (!this.isFileTypeAllowed(file)) {
  //     this.toastr.error('Tipo de arquivo não permitido.', 'Erro');
  //     return;
  //   }

  //   if (file.size > 5 * 1024 * 1024) {
  //     this.toastr.error('O arquivo é muito grande. O tamanho máximo permitido é 5MB.', 'Erro');
  //     return;
  //   }

  //   if (this.numFilesAttached >= this.limiteArquivos) {
  //     this.toastr.error(`Limite de ${this.limiteArquivos} arquivos atingido.`, 'Erro');
  //     return;
  //   }

  //   const novoArquivo: Arquivo = {
  //     id: this.numFilesAttached + 1,
  //     descricao: file.name,
  //     tipoArquivo: file.name.split('.').pop(),
  //     arquivo: file,
  //     base64: ""
  //   };

  //   this.dataSourceFile.data = [...this.dataSourceFile.data, novoArquivo];

  //   this.numFilesAttached++;
  //   this.updateFilesDisplay();
  //   this.listaArquivo = this.dataSourceFile.data;
  //   console.log(this.listaArquivo)
  // }
  // removeFile(arquivo: Arquivo): void {
  //   this.dataSourceFile.data = this.dataSourceFile.data.filter(a => a !== arquivo);
  //   this.numFilesAttached--;
  //   this.updateFilesDisplay();
  //   this.toastr.success('Arquivo deletado com sucesso.', 'Sucesso');
  // }

  // updateFilesDisplay(): void {
  //   this.filesDisplay = this.numFilesAttached > 0 ? `${this.numFilesAttached}/${this.limiteArquivos}` : '';
  // }

  // isFileTypeAllowed(file: File): boolean {
  //   const allowedFileTypes = ['.doc', '.pdf', '.png', '.jpeg', '.jpg'];
  //   const fileType = '.' + file.name.split('.').pop();

  //   return allowedFileTypes.includes(fileType);
  // }

  // validationSave() {
  //   if (this.userForm.get('pedidoParcelado')?.value) {
  //     const parcelas = parseFloat(this.parcelas.reduce((total, parcela) => total + parcela.valorParcela, 0).toFixed(2));
  //     const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'))

  //     if (valorTotal !== parcelas) {
  //       this.toastr.error('O valor total das parcelas deve ser igual ao valor total do pedido', 'Erro');
  //       return;
  //     }
  //   }
  //   this.salvar();
  // }


  // salvar() {
  //   this.toastr.success('Pedido salvo com sucesso', 'Sucesso');
  // }

  // voltar() {
  //   this.router.navigate(['/pedido/consultar']);

  // }


  // filteredBancos: Observable<any[]> | undefined;
  // private _filterBancos(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.listaBancos.filter(banco => banco.toLowerCase().includes(filterValue));
  // }





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
    this.preencheListaFuncionario()

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
    TipoPedido: new UntypedFormControl(1),
    TerceiroID: new UntypedFormControl(undefined),
    descricao: new UntypedFormControl(undefined),
    listaFormaPagamento: new UntypedFormArray([]),
    nome: new UntypedFormControl(undefined, Validators.required),
    cpf: new UntypedFormControl(undefined),
    cnpj: new UntypedFormControl(undefined),
    contaCnpj: new UntypedFormControl(undefined),
    anexo: new UntypedFormArray([]),
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
    // this.idPedido = this.activatedRoute.snapshot.params['id']
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
    this.idPedido = 0
    this.desabilitarInputs()
    this.getCurrentDate();
    //this.preencheUsuario()
    this.listaTiposTerceiro = TipoTerceiroSelect.tiposTerceiro.map(terceiro => terceiro.descricao);
    this.listaTipoRateio = TipoRateioSelect.tipoRateio

    this.preencheQtdParcelas()

    //this.preencheListaFuncionario()
  }




  dataUltimoPedido: any
  retornaUltimoPedido(id: any) {
    this.pedidoService.getUltimoPedidoTerceiro(id).subscribe(
      (data: any) => {
        this.ultimoPedido = data
        if (this.ultimoPedido == null || this.ultimoPedido == undefined) {
          this.dataUltimoPedido = ""
          this.limparTela()
        }else{
          this.dataUltimoPedido = this.ultimoPedido.dataCadastro
        }
      }
    )
  }

  usarUltimoPedido() {
    this.setUltimoPedidoEmTela()
  }

  setUltimoPedidoEmTela() {
    this.preencheListaFuncionario()
    this.terceiroService.getTerceiroById(this.ultimoPedido.formaPagamento[0].terceiro.id).subscribe(
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

    this.contaService.getListContasPorIdTerceiro(this.ultimoPedido.usuario.id).subscribe(
      (data: any[]) => {
        this.listaContasTerceiro = data
        const contaSelecionada = this.listaContasTerceiro.find(conta => conta.id === this.ultimoPedido.formaPagamento[0].contaBancaria ? this.ultimoPedido.formaPagamento[0].contaBancaria.id : this.ultimoPedido.formaPagamento[0].contaBancariaTerceiro.id)?.id
        this.formaPagamentoForm.get('idContaBancariaTerceiro')?.setValue(contaSelecionada)
        this.atualizarDadosBancariosInput()
      }
    )


    this.formaPagamentoForm.get('tipoPagamento')?.setValue(this.ultimoPedido.formaPagamento[0].tipoPagamento)
    this.pedidoService.getAnexoByIdPedido(this.ultimoPedido.id).subscribe(
      (data: any[]) => {
        this.arquivosBase64 = data;
        this.arquivosBase64.map(arquivo => {
          arquivo.arquivo = this.base64toFile(arquivo.base64, arquivo.descricao)
        })
        this.filesDisplay = `${this.arquivosBase64.length}/${this.limiteArquivos}`
      }
    )
    const formatador = new FormatadorData();
    const hoje: Date = new Date();
    const dataAtual: string = hoje.toISOString().slice(0, 10);
    this.formaPagamentoForm.get('dataPagamento')?.setValue(dataAtual)
    this.formaPagamentoForm.get('dataVencimento')?.setValue(dataAtual)
    this.formaPagamentoForm.get('valorTotal')?.setValue(this.ultimoPedido.formaPagamento[0].valorTotal)
    this.formaPagamentoForm.get('descricao')?.setValue(this.ultimoPedido.descricao)
    this.preencheListaCentros(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)
    this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(this.ultimoPedido.formaPagamento[0].centroDeCusto.id)

    if (this.ultimoPedido.formaPagamento[0].parcelas.length > 1) {
      this.formaPagamentoForm.get('exibirParcelas')?.setValue(true)
      this.formaPagamentoForm.get('pedidoParcelado')?.setValue(true)
      this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(this.ultimoPedido.formaPagamento[0].quantidadeParcelas)
      this.gerarParcelas()
    }

  }

  findPedidoByCodigo() {
    this.pedidoService.getPedidoById(this.idPedido).subscribe(
      (pedido: any) => {
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
        this.formaPagamentoForm.get('valorTotal')?.setValue(pedido.formaPagamento[0].valorTotal)
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


  preencheListaFuncionario() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFuncionario = data.filter((funcionario: any) => funcionario.tipoTerceiro === 1);
        this.filteredFuncionarios = this.meuPedidoForm.controls['TerceiroID'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterFuncionarios(value))
        );
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
      this.router.navigate(['/administracao/relatorio-pedido'], { state: { relatorio: 'fornecedor' } });
    } else {
      this.router.navigate(['/pedido/fornecedor-consultar']);
    }

  }
  validationSave() {
    this.isSubmitting = true;
    if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
      const parcelas = parseFloat(this.parcelas.reduce((total, parcela) => total + parcela.valorParcela, 0).toFixed(2));
      const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value)

      if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
        if (this.parcelas.length <= 0) {
          this.toastr.warning('Selecione a quantidade de parcelas!', 'Atenção');
          this.isSubmitting = false;
          return;
        }
      }
      if (valorTotal !== parcelas) {
        this.toastr.warning('O valor total das parcelas deve ser igual ao valor total do pedido', 'Atenção');
        this.isSubmitting = false;
        return;
      }
    }
    // if(this.userForm.get('rateio')?.value){
    //   const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'))
    //   const valorRateio = this.dataSourceRateio.data.reduce((total, rateio) => total + rateio.valor, 0);
    //   if(valorTotal !== valorRateio){
    //     this.toastr.error('O valor total das parcelas deve ser igual ao valor total do pedido', 'Erro');
    //     return;
    //   }
    // }
    const dataVencimento = this.datePipe.transform(this.formaPagamentoForm.get('dataVencimento')?.value, 'dd/MM/yyyy');
    const dataPagamento = this.datePipe.transform(this.formaPagamentoForm.get('dataPagamento')?.value, 'dd/MM/yyyy');
    const today = new Date();
    const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (dataVencimento) {
      const [day, month, year] = dataVencimento.split('/');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

      if (date < formattedDate) {
        this.toastr.warning('A data de vencimento não pode ser anterior à data atual', 'Atenção');
        this.isSubmitting = false;
        return;
      }
    }

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


    if (!this.formaPagamentoForm.get('exibirParcela')?.value) {
      this.parcelaForm.get('dataPagamento')?.setValue(this.formaPagamentoForm.get('dataPagamento')?.value)
      this.parcelaForm.get('dataVencimento')?.setValue(this.formaPagamentoForm.get('dataVencimento')?.value)
      this.parcelaForm.get('valorParcela')?.setValue(this.formaPagamentoForm.get('valorTotal')?.value)
      this.parcelaForm.get('parcelaReferencia')?.setValue(1)
    }

    if (this.formaPagamentoForm.get('pedidoParcelado')?.value) {
      const listaParcelas = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;

      if (listaParcelas.length > 0) {
        const primeiroItem = listaParcelas.at(0);

        const primeiroItemValues = primeiroItem.value;

        if (primeiroItemValues.dataPagamento != this.formaPagamentoForm.get('dataPagamento')?.value) {
          this.toastr.warning('A data de pagamento foi alterada, clique no botão "Gerar parcelas" para atualizar".', 'Atenção')
          this.isDateParcelaInvalid = true
          this.rolarParaSecaoDestino()
          this.isSubmitting = false
          return
        }
      }
    }

    const parcelaArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;


    if(parcelaArray.length <= 0){

      const parcelaArrqay = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
      parcelaArrqay.push(this.parcelaForm);
      this.formaPagamentoForm.get('quantidadeParcelas')?.setValue(1)
    }


    this.salvar();

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
        this.router.navigate(['/pedido/fornecedor-consultar']);
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
    // console.log('Selected Forma de pagamento: ', this.pedidoPagamento.formaPagamento);
    if (this.pedidoPagamento.formaPagamento == "Parcelado") {
      this.pgtoParcelado = true;
    } else {
      this.pgtoParcelado = false;

    }
  }
  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;

    this.limparCpfCnpj();
  }

  // preencheUsuario() {
  //   this.usuarioService.getByToken().subscribe(
  //     (data: Usuario) => {

  //       this.formaPagamentoForm.get('idUsuario')?.setValue(data.id)
  //       this.meuPedidoForm.get('UsuarioID')?.setValue(data.id);
  //       this.meuPedidoForm.get('nome')?.setValue(data.nome);
  //       this.idUsuario = data.id;
  //       if (data.cpf != '') {
  //         this.meuPedidoForm.get('cpf')?.setValue(data.cpf);
  //         this.meuPedidoForm.get('contaCnpj')?.setValue(false);
  //       } else {
  //         this.meuPedidoForm.get('cnpj')?.setValue(data.cnpj);
  //         this.meuPedidoForm.get('contaCnpj')?.setValue(true);
  //       }
  //       this.preencheDadosBancariosUsuario()
  //       if (data.idCentroCusto > 0) {
  //         this.preencheListaCentros(data.idCentroCusto)
  //         this.formaPagamentoForm.get('idCentroDeCusto')?.setValue(data.idCentroCusto)
  //       }
  //     }
  //   )
  // }

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
    this.contaService.getContaPorIdTerceiro(idConta).subscribe(
      (data: any) => {
        this.formaPagamentoForm.get('conta')?.setValue(data.conta);
        this.formaPagamentoForm.get('agencia')?.setValue(data.agencia);
        this.formaPagamentoForm.get('pix')?.setValue(data.chavePix);
        this.formaPagamentoForm.get('tipoConta')?.setValue(this.mapeamentoEnumService.mapearTipoContaDescricao(data.tipoConta));
      }
    )
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



  gerarParcelas() {
    const listaParcelasArray = this.formaPagamentoForm.get('listaParcelas') as UntypedFormArray;
    if (listaParcelasArray) {
      listaParcelasArray.clear();
    }
    const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value);

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

      for (let i = 0; i < qtdParcelas; i++) {
        const valorParcela = (i === 0) ? valorParcelaSemCentavos + centavosRestantes : valorParcelaSemCentavos;
        const parcela: Parcelas = {
          id: i + 1,
          parcelaReferencia: i + 1,
          dataVencimento: this.formatarData(dataVencimento),
          dataPagamento: this.formatarData(dataPagamento),
          valorParcela: parseFloat(valorParcela.toFixed(2)),
          statusPagamento: 0,
          quantidadeParcelas: qtdParcelas,
          exclusao: false,
        };
        this.parcelas.push(parcela);
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
      this.dataSource.data = [...this.parcelas];
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

    const valorTotal = parseFloat(this.formaPagamentoForm.get('valorTotal')?.value)

    // const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));


    if (valorTotal && qtdParcelas) {
      const valorParcela = valorTotal / qtdParcelas;
      return `x R$${valorParcela.toFixed(0)}`;
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

  popularFornecedorInput(userId: number) {
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
    //this.setUltimoPedidoEmTela()



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


  filteredFuncionarios: Observable<any[]> | undefined;
  private _filterFuncionarios(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaFuncionario.filter(funcionario => funcionario.nome.toLowerCase().includes(filterValue));
  }

  onSelect(event: MatAutocompleteSelectedEvent) {
    const funcionario = event.option.value;
    this.meuPedidoForm.get('TerceiroID')!.setValue(funcionario);
  }

  get nomeFuncionario(): any {
    const idFuncionario = this.meuPedidoForm.get('TerceiroID')?.value

    const func = this.listaFuncionario.filter(funcionario => funcionario.id == idFuncionario)
    console.log(func)
    return func
  }


}
