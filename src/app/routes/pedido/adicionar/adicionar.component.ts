import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Arquivo } from 'app/models/auxiliar/arquivo';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Parcelas } from 'app/models/parcelas';
import { PedidoPagamento } from 'app/models/pedidoPagamento';
import { DialogEditParcelaDialogComponent } from 'app/routes/dialog/edit-parcela-dialog/edit-parcela-dialog.component';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { ToastrService } from 'ngx-toastr';
import { TipoTerceiroSelect } from 'app/util/classes/select-tipo-terceiro';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { TipoRateioSelect } from 'app/util/classes/select-tipo-rateio';
import { CentroDeCustoService } from 'app/routes/centro-de-custo/centro-de-custo.service';
import { Usuario } from 'app/models/usuario';
import { Rateio } from 'app/models/rateio';
import { DialogEditRateioDialogComponent } from 'app/routes/dialog/edit-rateio-dialog/edit-rateio-dialog.component';
import { PedidoService } from '../pedido.service';
import { RequestPedido } from 'app/models/auxiliar/request-pedido';


@Component({
  selector: 'app-pedido-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],

})
export class PedidoAdicionarComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['data', 'valor', 'actions'];
  displayedColumnsRateio: string[] = ['nome', 'valor', 'actions'];

  displayedColumnsFiles: string[] = ['file', 'actions'];
  isSubmitting = false;
  // userForm: FormGroup;
  contaCnpj: boolean = false;
  pedidoPagamento: PedidoPagamento = new PedidoPagamento();
  listaBancos: string[] = [];
  listaFormaPagamento: { id: number; descricao: string }[] = FormasPagamentoSelect.formasPagamento;
  listaParcelas: number[] = []
  pgtoParcelado: boolean = false;
  currentDate: string = "";
  idUsuario: number = 0;
  listaContasUsuario: ContaUsuario[] = []
  parcelas: Parcelas[] = [];
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
    private pedidoService: PedidoService
  ) {
    this.meuPedifoForm.valueChanges.subscribe(s => {
      console.log(s);
    });
    // this.userForm = this.formBuilder.group({
    //   nome: ['', Validators.required],
    //   cpf: [''],
    //   cnpj: [''],
    //   bancoCadastrado: ['', Validators.required],
    //   formaPagamento: ['', Validators.required],
    //   dataPagamento: ['', Validators.required],
    //   dataVencimento: ['', Validators.required],
    //   valorTotalPagamento: ['', Validators.required],
    //   qtdParcelas: [''],
    //   descricaoPagamento: [''],
    //   contaCnpj: [''],
    //   pedidoParcelado: [false],
    //   gerarParcelas: [false],
    //   centroCusto: ['', Validators.required],

    //   tipoConta: [''],
    //   agencia: [''],
    //   conta: [''],
    //   pix: [''],

    //   exibirParcelas: [false],
    //   tipoTerceiro: [this.listaTiposTerceiro[0]],
    //   rateio: [false],
    //   usuarioRateio: [''],
    //   valorRateioPessoa: ['']

    // }, {
    //   validators: this.cpfCnpjRequiredValidator
    // });
  }



  public meuPedifoForm: UntypedFormGroup = new UntypedFormGroup({

    UsuarioID: new UntypedFormControl(0),
    TipoPedido: new UntypedFormControl(0),
    ContaID: new UntypedFormControl(undefined,Validators.required),
    CentroDeCustoID: new UntypedFormControl(0,Validators.required),
    formaPagamento: new UntypedFormControl(undefined, Validators.required),
    dataPagamento: new UntypedFormControl(undefined, Validators.required),
    dataVencimento: new UntypedFormControl(undefined, Validators.required),
    valorTotal: new UntypedFormControl(undefined, Validators.required),
    quantidadeParcelas: new UntypedFormControl(undefined),


    id: new UntypedFormControl(0),
    nome: new UntypedFormControl(undefined, Validators.required),
    cpf: new UntypedFormControl(undefined),
    cnpj: new UntypedFormControl(undefined),
    // bancoCadastrado: new UntypedFormControl(undefined, Validators.required),
    descricaoPagamento: new UntypedFormControl(undefined),
    contaCnpj: new UntypedFormControl(undefined),
    pedidoParcelado: new UntypedFormControl(false),
    gerarParcelas: new UntypedFormControl(false),

    tipoConta: new UntypedFormControl(undefined),
    agencia: new UntypedFormControl(undefined),
    conta: new UntypedFormControl(undefined),
    pix: new UntypedFormControl(undefined),

    exibirParcelas: new UntypedFormControl(false),
    tipoTerceiro: new UntypedFormControl(this.listaTiposTerceiro[0]),
    rateio: new UntypedFormControl(false),
    usuarioRateio: new UntypedFormControl(undefined),
    valorRateioPessoa: new UntypedFormControl(undefined)
  });



  ngOnInit() {
    this.desabilitarInputs()
    this.getCurrentDate();
    this.preencheUsuario()
    // this.listaFormaPagamento = FormasPagamentoSelect.formasPagamento.map(forma => forma.descricao);
    this.listaTiposTerceiro = TipoTerceiroSelect.tiposTerceiro.map(terceiro => terceiro.descricao);
    this.listaTipoRateio = TipoRateioSelect.tipoRateio
    this.preencheQtdParcelas()
    this.preencheListaCentros()
    this.preencheListaFuncionario()
    // this.userForm.valueChanges.subscribe(form => {
    //   if (form.valorTotalPagamento) {
    //     // Removendo todos os caracteres não numéricos
    //     let valorSemNaoNumericos = form.valorTotalPagamento.replace(/\D/g, '');
    //     // Removendo os zeros à esquerda
    //     valorSemNaoNumericos = valorSemNaoNumericos.replace(/^0+/, '');
    //     // Convertendo para número
    //     let valorNumerico = parseInt(valorSemNaoNumericos, 10) / 100; // Convertendo centavos
    //     // Formatando para a moeda BRL
    //     const valorFormatado = this.currencyPipe.transform(valorNumerico, 'BRL', 'symbol', '1.2-2');
    //     // Substituindo o ponto por vírgula para a formatação correta da moeda BRL
    //     const valorFinal = valorFormatado?.replace('.', ',');
    //     this.userForm.patchValue({ valorTotalPagamento: valorFinal }, { emitEvent: false });
    //   }
    // });
  }

  preencheListaFuncionario() {
    this.usuarioService.getListFuncionario().subscribe(
      (data: Usuario[]) => {
        this.listaUsuarios = data;
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
  getCurrentDate(): void {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (formattedDate) {
      this.pedidoPagamento.dataPagamento = formattedDate;
      this.pedidoPagamento.dataVencimento = formattedDate
      this.meuPedifoForm.get('dataPagamento')?.setValue(formattedDate);
      this.meuPedifoForm.get('dataVencimento')?.setValue(formattedDate);
    } else {
      console.error('Erro ao formatar a data.');
    }
  }

  preencheQtdParcelas() {
    for (let i = 2; i <= 60; i++) {
      this.listaParcelas.push(i);
    }
  }

  onSubmit() {
    if (this.meuPedifoForm.valid) {
      this.isSubmitting = true;

      const userData: any = this.meuPedifoForm.value;
      console.log(userData);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 3000);
    }
  }

  voltar() {
    this.router.navigate(['/pedido/consultar']);

  }

  validationSave() {
    if (this.meuPedifoForm.get('pedidoParcelado')?.value) {
      const parcelas = parseFloat(this.parcelas.reduce((total, parcela) => total + parcela.valor, 0).toFixed(2));
      // const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'))
      const valorTotal = parseFloat(this.meuPedifoForm.get('valorTotalPagamento')?.value)


      if (valorTotal !== parcelas) {
        this.toastr.warning('O valor total das parcelas deve ser igual ao valor total do pedido', 'Erro');
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
    this.salvar();


  }


  salvar() {
    // console.log(this.meuPedifoForm.value)
   this.pedidoService.criarPedido(this.meuPedifoForm.getRawValue()).subscribe(
    (data: RequestPedido) => {
      this.toastr.success('Pedido salvo com sucesso', 'Sucesso');

    }
   )
  }

  cpfCnpjRequiredValidator(): { [key: string]: boolean } | null {
    const cpfControl = this.meuPedifoForm.get('cpf')?.value;
    const cnpjControl = this.meuPedifoForm.get('cnpj')?.value;

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
    this.meuPedifoForm.get('cpf')?.setValue('')
    this.meuPedifoForm.get('cnpj')?.setValue('')
  }

  retorno: string = ""
  validaFormaPagamento() {
    console.log('Selected Forma de pagamento: ', this.pedidoPagamento.formaPagamento);
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

  preencheUsuario() {
    this.usuarioService.getByToken().subscribe(
      (data: Usuario) => {
        this.meuPedifoForm.get('UsuarioID')?.setValue(data.id);
        this.meuPedifoForm.get('nome')?.setValue(data.nome);
        this.idUsuario = data.id;
        if (data.cpf != '') {
          this.meuPedifoForm.get('cpf')?.setValue(data.cpf);
          this.meuPedifoForm.get('contaCnpj')?.setValue(false);
        } else {
          this.meuPedifoForm.get('cnpj')?.setValue(data.cnpj);
          this.meuPedifoForm.get('contaCnpj')?.setValue(true);
        }
        this.preencheDadosBancariosUsuario()
        if (data.idCentroCusto > 0) {
          this.meuPedifoForm.get('CentroDeCustoID')?.setValue(data.idCentroCusto)
        }
      }
    )
  }

  preencheDadosBancariosUsuario() {
    this.contaService.getListContasPorTokenUsuario().subscribe(
      (data: ContaUsuario[]) => {
        this.listaContasUsuario = data;
      }
    )
  }

  atualizaDadosInput() {
    const dado = this.meuPedifoForm.get('ContaID')?.value;
    this.contaService.getContaPorIdUsuario(dado).subscribe(
      (data: ContaTerceiro) => {
        this.meuPedifoForm.get('conta')?.setValue(data.conta);
        this.meuPedifoForm.get('agencia')?.setValue(data.agencia);
        this.meuPedifoForm.get('pix')?.setValue(data.chavePix);
        this.meuPedifoForm.get('tipoConta')?.setValue(this.mapeamentoEnumService.mapearTipoContaDescricao(data.tipoConta));
      }
    )
  }

  desabilitarInputs() {
    this.meuPedifoForm.get('conta')?.disable();
    this.meuPedifoForm.get('agencia')?.disable();
    this.meuPedifoForm.get('pix')?.disable();
    this.meuPedifoForm.get('tipoConta')?.disable();
    this.meuPedifoForm.get('nome')?.disable();
    this.meuPedifoForm.get('cpf')?.disable();
    this.meuPedifoForm.get('cnpj')?.disable();
  }
  onFileSelected(event: any): void {
    this.toastr.clear();

    const file = event.target.files[0];

    if (!this.isFileTypeAllowed(file)) {
      this.toastr.warning('Tipo de arquivo não permitido.', 'Erro');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('O arquivo é muito grande. O tamanho máximo permitido é 5MB.', 'Erro');
      return;
    }

    if (this.numFilesAttached >= this.limiteArquivos) {
      this.toastr.warning(`Limite de ${this.limiteArquivos} arquivos atingido.`, 'Erro');
      return;
    }

    const novoArquivo: Arquivo = {
      id: this.numFilesAttached + 1,
      name: file.name,
      arquivo: file,
      base64: ""
    };
    this.converterParaBase64(novoArquivo);

    console.log(this.arquivosBase64)
    this.dataSourceFile.data = [...this.dataSourceFile.data, novoArquivo];

    this.numFilesAttached++;
    this.updateFilesDisplay();
    this.listaArquivo = this.dataSourceFile.data;
  }

  converterParaBase64(arquivo: Arquivo) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      arquivo.base64 = base64String;
    };
    this.arquivosBase64.push(arquivo)
    reader.readAsDataURL(arquivo.arquivo);
  }

  removeFile(arquivo: Arquivo): void {
    this.dataSourceFile.data = this.dataSourceFile.data.filter(a => a !== arquivo);
    this.arquivosBase64 = this.arquivosBase64.filter(a => a !== arquivo)
    this.numFilesAttached--;
    this.updateFilesDisplay();
    this.toastr.success('Arquivo deletado com sucesso.', 'Sucesso');
    console.log(this.arquivosBase64)
  }

  updateFilesDisplay(): void {
    this.filesDisplay = this.numFilesAttached > 0 ? `${this.numFilesAttached}/${this.limiteArquivos}` : '';
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedFileTypes = ['.doc', '.pdf', '.png', '.jpeg', '.jpg'];
    const fileType = '.' + file.name.split('.').pop();

    return allowedFileTypes.includes(fileType);
  }

  gerarParcelas() {
    // const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));
    const valorTotal = parseFloat(this.meuPedifoForm.get('valorTotalPagamento')?.value);

    const qtdParcelas = this.meuPedifoForm.get('qtdParcelas')?.value;
    const dataPagamentoStr = this.meuPedifoForm.get('dataPagamento')?.value;

    if (valorTotal == 0 || qtdParcelas == 0 || dataPagamentoStr == "") {
      this.toastr.warning('Informações de pagamento incompletas', 'Erro');
      return;
    }

    this.meuPedifoForm.get('exibirParcelas')?.setValue(true);

    if (valorTotal && qtdParcelas && dataPagamentoStr) {
      this.parcelas = [];
      let dataVencimento = new Date(dataPagamentoStr + 'T00:00:00Z');

      // Calcula o valor das parcelas (sem centavos)
      const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
      const centavosRestantes = valorTotal % qtdParcelas;

      for (let i = 0; i < qtdParcelas; i++) {
        const valorParcela = (i === 0) ? valorParcelaSemCentavos + centavosRestantes : valorParcelaSemCentavos;
        const parcela: Parcelas = {
          id: i + 1,
          dataVencimento: this.formatarData(dataVencimento),
          valor: parseFloat(valorParcela.toFixed(2)),
          exclusao: false, // Adiciona a propriedade exclusao
        };
        this.parcelas.push(parcela);

        dataVencimento.setUTCMonth(dataVencimento.getUTCMonth() + 1);
      }

      this.dataSource.data = [...this.parcelas];
    }
    console.log(this.parcelas);
  }

  formatarData(data: Date): string {
    const year = data.getUTCFullYear();
    const month = ('0' + (data.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + data.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  tooglePedidoParcelado(event: MatSlideToggleChange) {
    this.meuPedifoForm.get('pedidoParcelado')?.setValue(event.checked)
    this.meuPedifoForm.get('qtdParcelas')?.setValue(0)
    this.parcelas = []
    this.dataSource.data = [...this.parcelas];
    this.meuPedifoForm.get('rateio')?.disable()
    if (!event.checked) {
      this.meuPedifoForm.get('exibirParcelas')?.setValue(false)
      this.meuPedifoForm.get('rateio')?.enable()
    }
  }

  toogleRateio(event: MatSlideToggleChange) {
    this.meuPedifoForm.get('pedidoParcelado')?.disable()
    if (!event.checked) {
      this.meuPedifoForm.get('pedidoParcelado')?.enable()
      this.meuPedifoForm.get('usuarioRateio')?.setValue('')
      this.rateio = []
      this.dataSourceRateio.data = [...this.rateio];
    }
  }

  openDialog(parcela: Parcelas): void {
    parcela.exclusao = false;
    const dialogRef = this.dialog.open(DialogEditParcelaDialogComponent, {
      width: '350px',
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
    this.meuPedifoForm.get('usuarioRateio')?.setValue('')

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
      this.parcelas.splice(index, 1);
      this.dataSource.data = [...this.parcelas];
    }
  }

  calcularValorParcela(qtdParcelas: number): string {

    const valorTotal = parseFloat(this.meuPedifoForm.get('valorTotalPagamento')?.value)

    // const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));


    if (valorTotal && qtdParcelas) {
      const valorParcela = valorTotal / qtdParcelas;
      return `x R$${valorParcela.toFixed(0)}`;
    }
    return '';
  }

  openNewWindow(arquivo: Arquivo): void {
    const fileType = arquivo.name.substring(arquivo.name.lastIndexOf('.') + 1);

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
    if (this.meuPedifoForm.get('valorTotalPagamento')?.value <= 0) {
      this.toastr.warning('Preencha o valor total do pagamento primeiro', 'Atenção');
      this.meuPedifoForm.get('usuarioRateio')?.setValue('')
      return;
    }
    const userId = this.meuPedifoForm.get('usuarioRateio')?.value;
    const usuario = this.listaUsuarios.find(item => item.id === userId);

    if (usuario) {
      const isAlreadyInRateio = this.dataSourceRateio.data.some(item => item.id === usuario.id);

      if (isAlreadyInRateio) {
        this.toastr.warning('Pessoa já está na lista de rateio.', 'Atenção');
      } else {
        const valorUsuarioRateio = this.meuPedifoForm.get('valorTotalPagamento')?.value / 2
        this.meuPedifoForm.get('valorTotalPagamento')?.setValue(valorUsuarioRateio)
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
    this.meuPedifoForm.get('usuarioRateio')?.setValue('')

  }

  ngAfterViewInit() {
  }

}
