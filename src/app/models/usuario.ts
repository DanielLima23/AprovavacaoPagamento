import { FormatadorData } from "./auxiliar/formatador-date";
import { ContaUsuario } from "./conta-usuario";

export class Usuario extends FormatadorData{
    id!: number;
    nome! : string;
    email! : string;
    cpf!: string;
    cnpj!: string;
    celular!: string;
    dataNascimento! :string
    senha! : string;
    tipoCnpj!: boolean
    token!: string
    idCentroCusto: number= 0
    contas: ContaUsuario[]=[]
    nomeCentroDeCusto: string = ""
    reponsavelAprovacao: boolean = false;

}
