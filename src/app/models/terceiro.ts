import { Banco } from "./banco";
import { Cliente } from "./cliente";
import { ContaTerceiro } from "./conta-terceiro";
import { TipoPagamento } from "./enum/tipo-pagamento.enum";
import { TipoTerceiro } from "./enum/tipo-terceiro.enum";

export class Terceiro {
  id: number = 0;
  nome!: string;

  cpf!: string;
  cnpj!: string;
  finalidade!: string;
  idCentroCusto: number = 0;

  tipoTerceiro!: TipoTerceiro;
  tipoPagamento!: TipoPagamento;
  tipoPagamentoDTO!: string;
  cliente!: Cliente;

  // contas : ContaTerceiro[]=[]

}
