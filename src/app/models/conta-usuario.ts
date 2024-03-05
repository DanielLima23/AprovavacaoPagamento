import { Conta } from "./conta";
import { Usuario } from "./usuario";

export class ContaUsuario extends Conta {
    usuario : Usuario = new Usuario()
}