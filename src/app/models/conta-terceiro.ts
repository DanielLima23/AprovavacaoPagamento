import { Conta } from "./conta";
import { Terceiro } from "./terceiro";

export class ContaTerceiro extends Conta {
    terceiro : Terceiro = new Terceiro();
    // terceiroId : number = 0

}