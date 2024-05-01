import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../pedido.service';
import { DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pedido-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class PedidoConsultarComponent implements OnInit {


  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos: any = [];
  idPedido: number = 0

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  public consultarPedidoForm: UntypedFormGroup = new UntypedFormGroup({
    dataInicio: new UntypedFormControl(undefined),
    dataFim: new UntypedFormControl(undefined),
  });

  ngOnInit() {
    this.getCurrentDate()
    this.consultarPedidosNaInicializacao()
  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  verPedido(id: number) {
    this.idPedido = id
    this.router.navigate(['/pedido/adicionar'], { state: { id: id } });
  }

  // preencheListaPedidos() {
  //   this.pedidoService.getListPedidosUsuario().subscribe(data => {
  //     this.pedidos = data
  //   })
  // }


  getCurrentDate(): void {
    const dataInicio = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    const dataFim = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    this.consultarPedidoForm.get('dataInicio')?.setValue(dataInicio);
    this.consultarPedidoForm.get('dataFim')?.setValue(dataFim);
  }

  consultarPedidos(){
    this.pedidoService.getPedidosUsuarioPorData(this.consultarPedidoForm.get('dataInicio')?.value, this.consultarPedidoForm.get('dataFim')?.value).subscribe(
      (data: any[]) => {
        this.pedidos = data;
        if(this.pedidos.length === 0){
          this.toastr.warning('Nenhum pedido encontrado','Atenção')
        }
      }
    )
  }

  consultarPedidosNaInicializacao(){
    this.pedidoService.getPedidosUsuarioPorData(this.consultarPedidoForm.get('dataInicio')?.value, this.consultarPedidoForm.get('dataFim')?.value).subscribe(
      (data: any[]) => {
        this.pedidos = data;

      }
    )
  }
}
