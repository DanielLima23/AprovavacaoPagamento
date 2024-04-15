export class RequestPedido {
  UsuarioID: number = 0
  TipoPedido: number = 0
  ContaID: number = 0
  CentroDeCustoID: number = 0
  formaPagamento!: number
  dataPagamento: Date = new Date()
  dataVencimento: Date = new Date()
  valorTotal: number = 0
  valorParcela: number = 0
  quantidadeParcelas: number = 0
}
