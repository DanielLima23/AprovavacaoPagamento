export class RequestAprovaPedido {
  PedidoID: number = 0;
  CentroID: number = 0;
  diretor: number = 0
  ceo: number = 0;
  financeiro: number = 0;
  responsavel: number = 0;
  Observacao: string = '';

  constructor(pedido: any, centroId: any, obs: any) {
    this.PedidoID = pedido.pedidoId;
    this.CentroID = centroId;
    this.diretor = pedido.diretor;
    this.ceo = pedido.ceo;
    this.financeiro = pedido.financeiro;
    this.responsavel = pedido.responsavel;
    this.Observacao = obs;
  }


}
