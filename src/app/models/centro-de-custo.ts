import { Cliente } from "./cliente";
import { Usuario } from "./usuario";

export class CentroDeCusto {
  id: number = 0;
  descricao!: string;
  dataCadastro: Date = new Date()
  reponsavel: Usuario = new Usuario()
  reponsavelAprovacao!: boolean
  financeiroAprovacao!: boolean
  ceoAprovacao!: boolean
  diretorAprovacao!: boolean
  cliente : Cliente = new Cliente()
}
