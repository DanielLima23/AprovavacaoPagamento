import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Arquivo } from 'app/models/auxiliar/arquivo';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { ContaTerceiro } from 'app/models/conta-terceiro';
import { ContaUsuario } from 'app/models/conta-usuario';
import { Parcelas } from 'app/models/parcelas';
import { PedidoPagamento } from 'app/models/pedidoPagamento';
import { Terceiro } from 'app/models/terceiro';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/centro-de-custo/centro-de-custo.service';
import { DialogEditParcelaDialogComponent } from 'app/routes/dialog/edit-parcela-dialog/edit-parcela-dialog.component';
import { TerceiroService } from 'app/routes/terceiro/terceiro.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ContaBancariaService } from 'app/services-outros/conta-bancaria.service';
import { FormasPagamentoSelect } from 'app/util/classes/select-formas-pagamento';
import { MapeamentoEnumService } from 'app/util/mapeamento-enum.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pedido-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class PedidoFornecedorComponent implements OnInit {

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  displayedColumns: string[] = ['data', 'valor', 'actions'];
  displayedColumnsFiles: string[] = ['file', 'actions'];
  isSubmitting = false;
  userForm: FormGroup;
  contaCnpj: boolean = false;
  pedidoPagamento: PedidoPagamento = new PedidoPagamento();
  listaBancos: string[] = [];
  listaFormaPagamento: string[] = [];
  listaParcelas: number[] = []
  pgtoParcelado: boolean = false;
  currentDate: string = "";
  idFornecedor: number = 0;
  listaContasFornecedor: ContaTerceiro[] = []
  parcelas: Parcelas[] = [];
  numFilesAttached: number = 0;
  fileNames: string[] = [];
  limiteArquivos: number = 10;
  filesDisplay: string = '';
  dataSource = new MatTableDataSource<Parcelas>(this.parcelas);
  dataSourceFile = new MatTableDataSource<Arquivo>();
  listaArquivo: Arquivo[] = []
  listaFornecedor: Terceiro[] = []
  listaCentroCusto: CentroDeCusto[]=[]


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private contaService: ContaBancariaService,
    private mapeamentoEnumService: MapeamentoEnumService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private terceiroService: TerceiroService,
    private centroCustoService: CentroDeCustoService,
  ) {
    this.userForm = this.formBuilder.group({
      fornecedor: [''],
      cpf: [''],
      cnpj: [''],
      bancoCadastrado: ['', Validators.required],
      formaPagamento: ['', Validators.required],
      dataPagamento: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valorTotalPagamento: ['', Validators.required],
      qtdParcelas: [''],
      descricaoPagamento: [''],
      contaCnpj: [''],
      pedidoParcelado: [false],
      gerarParcelas: [false],
      finalidade:[''],

      tipoConta: [''],
      agencia: [''],
      conta: [''],
      pix: [''],

      exibirParcelas: [false],
      centroCusto: ['',Validators.required],

    }, {
      validators: this.cpfCnpjRequiredValidator
    });
  }

  ngOnInit() {
    this.desabilitarInputs()
    this.getCurrentDate();
    this.preencheListaFornecedores()
    this.listaFormaPagamento = FormasPagamentoSelect.formasPagamento.map(forma => forma.descricao);
    this.preencheQtdParcelas()
    this.preencheListaCentros()

  }
  preencheListaCentros() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroCusto = data;
      }
    )
  }

  preencheQtdParcelas() {
    for (let i = 2; i <= 60; i++) {
      this.listaParcelas.push(i);
    }
  }

  preencheListaFornecedores() {
    this.terceiroService.getListaTerceiroPorCliente().subscribe(
      (data: Terceiro[]) => {
        this.listaFornecedor = data;
      }
    )
  }
  popularFornecedorInput(userId: number) {
    const fornecedor: Terceiro | undefined = this.listaFornecedor.find(f => f.id === userId);

    if (fornecedor) {
      if (fornecedor.cpf) {
        this.userForm.get('cpf')?.setValue(fornecedor.cpf);
        this.userForm.get('contaCnpj')?.setValue(false);
      } else {
        this.userForm.get('cnpj')?.setValue(fornecedor.cnpj);
        this.userForm.get('contaCnpj')?.setValue(true);
      }
    }
    this.userForm.get('finalidade')?.setValue(fornecedor?.finalidade);
    this.preencheListaContasTerceiro(fornecedor!.id)
    this.userForm.get('conta')?.setValue('');
    this.userForm.get('agencia')?.setValue('');
    this.userForm.get('pix')?.setValue('');
    this.userForm.get('tipoConta')?.setValue('');
    if(fornecedor!.idCentroCusto > 0){
      this.userForm.get('centroCusto')?.setValue(fornecedor!.idCentroCusto)
    }

  }
  preencheListaContasTerceiro(id: number) {
    this.contaService.getListContasPorIdTerceiro(id).subscribe(
      (data: ContaTerceiro[]) => {
        this.listaContasFornecedor = data;
      }
    )
  }

  getCurrentDate(): void {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (formattedDate) {
      this.pedidoPagamento.dataPagamento = formattedDate;
      this.pedidoPagamento.dataVencimento = formattedDate
      this.userForm.get('dataPagamento')?.setValue(formattedDate);
      this.userForm.get('dataVencimento')?.setValue(formattedDate);
    } else {
      console.error('Erro ao formatar a data.');
    }
  }

  desabilitarInputs() {
    this.userForm.get('conta')?.disable();
    this.userForm.get('agencia')?.disable();
    this.userForm.get('pix')?.disable();
    this.userForm.get('tipoConta')?.disable();
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

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.contaCnpj = event.checked;

    this.limparCpfCnpj();
  }

  limparCpfCnpj() {
    this.userForm.get('cpf')?.setValue('')
    this.userForm.get('cnpj')?.setValue('')
  }

  atualizaDadosInput() {
    const dado = this.userForm.get('bancoCadastrado')?.value;
    this.contaService.getContaPorIdTerceiro(dado).subscribe(
      (data: ContaTerceiro) => {
        this.userForm.get('conta')?.setValue(data.conta);
        this.userForm.get('agencia')?.setValue(data.agencia);
        this.userForm.get('pix')?.setValue(data.chavePix);
        this.userForm.get('tipoConta')?.setValue(this.mapeamentoEnumService.mapearTipoContaDescricao(data.tipoConta));
      }
    )
  }

  tooglePedidoParcelado(event: MatSlideToggleChange) {
    this.userForm.get('pedidoParcelado')?.setValue(event.checked)
    this.userForm.get('qtdParcelas')?.setValue(0)
    this.parcelas = []
    this.dataSource.data = [...this.parcelas];
    if (!event.checked) {
      this.userForm.get('exibirParcelas')?.setValue(false)
    }
  }

  calcularValorParcela(qtdParcelas: number): string {
    const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));
    if (valorTotal && qtdParcelas) {
      const valorParcela = valorTotal / qtdParcelas;
      return `x R$${valorParcela.toFixed(0)}`;
    }
    return '';
  }

  gerarParcelas() {
    const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'));
    const qtdParcelas = this.userForm.get('qtdParcelas')?.value;
    const dataPagamentoStr = this.userForm.get('dataPagamento')?.value;
    const dataVencimentoStr = this.userForm.get('dataVencimento')?.value;

    if (valorTotal == 0 || qtdParcelas == 0 || dataPagamentoStr == "") {
      return;
    }
    this.userForm.get('exibirParcelas')?.setValue(true);

    if (valorTotal && qtdParcelas && dataPagamentoStr) {
      this.parcelas = [];
      let dataPagamento = new Date(dataPagamentoStr + 'T00:00:00Z');
      let dataVencimento = new Date(dataVencimentoStr + 'T00:00:00Z');

      const valorParcelaSemCentavos = Math.floor(valorTotal / qtdParcelas);
      const centavosRestantes = valorTotal % qtdParcelas;

      for (let i = 0; i < qtdParcelas; i++) {
        const valorParcela = (i === 0) ? valorParcelaSemCentavos + centavosRestantes : valorParcelaSemCentavos;
        const parcela: Parcelas = {
          id: i + 1,
          parcelaReferencia: i + 1,
          dataVencimento: this.formatarData(dataPagamento),
          dataPagamento: this.formatarData(dataVencimento),
          valorParcela: parseFloat(valorParcela.toFixed(2)),
          exclusao: false,
        };
        this.parcelas.push(parcela);

        dataPagamento.setUTCMonth(dataPagamento.getUTCMonth() + 1);
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

  openDialog(parcela: Parcelas): void {
    parcela.exclusao = false;
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

  deletarParcela(id: any) {
    const index = this.parcelas.findIndex(objeto => objeto.id === id);

    if (index !== -1) {
      this.parcelas.splice(index, 1);
      this.dataSource.data = [...this.parcelas];
    }
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

  onFileSelected(event: any): void {
    this.toastr.clear();

    const file = event.target.files[0];

    if (!this.isFileTypeAllowed(file)) {
      this.toastr.error('Tipo de arquivo não permitido.', 'Erro');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('O arquivo é muito grande. O tamanho máximo permitido é 5MB.', 'Erro');
      return;
    }

    if (this.numFilesAttached >= this.limiteArquivos) {
      this.toastr.error(`Limite de ${this.limiteArquivos} arquivos atingido.`, 'Erro');
      return;
    }

    const novoArquivo: Arquivo = {
      id: this.numFilesAttached + 1,
      descricao: file.name,
      tipoArquivo: file.name.split('.').pop(),
      arquivo: file,
      base64: ""
    };

    this.dataSourceFile.data = [...this.dataSourceFile.data, novoArquivo];

    this.numFilesAttached++;
    this.updateFilesDisplay();
    this.listaArquivo = this.dataSourceFile.data;
    console.log(this.listaArquivo)
  }
  removeFile(arquivo: Arquivo): void {
    this.dataSourceFile.data = this.dataSourceFile.data.filter(a => a !== arquivo);
    this.numFilesAttached--;
    this.updateFilesDisplay();
    this.toastr.success('Arquivo deletado com sucesso.', 'Sucesso');
  }

  updateFilesDisplay(): void {
    this.filesDisplay = this.numFilesAttached > 0 ? `${this.numFilesAttached}/${this.limiteArquivos}` : '';
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedFileTypes = ['.doc', '.pdf', '.png', '.jpeg', '.jpg'];
    const fileType = '.' + file.name.split('.').pop();

    return allowedFileTypes.includes(fileType);
  }

  validationSave() {
    if (this.userForm.get('pedidoParcelado')?.value) {
      const parcelas = parseFloat(this.parcelas.reduce((total, parcela) => total + parcela.valorParcela, 0).toFixed(2));
      const valorTotal = parseFloat(this.userForm.get('valorTotalPagamento')?.value.replace(',', '.'))

      if (valorTotal !== parcelas) {
        this.toastr.error('O valor total das parcelas deve ser igual ao valor total do pedido', 'Erro');
        return;
      }
    }
    this.salvar();
  }


  salvar() {
    this.toastr.success('Pedido salvo com sucesso', 'Sucesso');
  }

  voltar() {
    this.router.navigate(['/pedido/consultar']);

  }

}
