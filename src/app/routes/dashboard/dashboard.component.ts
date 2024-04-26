import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { Router } from '@angular/router';
import { PedidoService } from '../pedido/pedido.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {


  pedidos: any = [];

  constructor(private router: Router,
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef // Adicionei ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.preencheListaPedidos()
  }

  verPedido(id: number) {
    this.router.navigate(['/pedido/adicionar'], { state: { id: id } });
  }

  preencheListaPedidos(){
    this.pedidoService.getListPedidosUsuario().subscribe(data => {
      this.pedidos = data
      this.cdr.detectChanges(); // Detectar mudanças

    })
  }

}
