import { TipoConta } from "./enum/tipo-conta.enum";
import { TipoPedido } from "./enum/tipo-pedido.enum";

export class Conta{
    id: number = 0;
    descricao!: string;
    banco!: string;
    tipoConta!: TipoConta;
    tipoContaDTO!: string;
    tipoPedido!: TipoPedido;
    agencia!: string;
    conta!: string;
    tipoCnpj!: boolean;
    cpf!: string;
    cnpj!: string;
    chavePix!: string;
    contaPadrao: boolean = false

}
