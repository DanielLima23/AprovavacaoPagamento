import { Injectable } from '@angular/core';
import { FormasPagamentoSelect } from './classes/select-formas-pagamento';
import { TipoContaSelect } from './classes/select-tipo-conta';
import { TipoTerceiro } from 'app/models/enum/tipo-terceiro.enum';
import { TipoTerceiroSelect } from './classes/select-tipo-terceiro';
import { TipoStatusUsuarioSelect } from './classes/select-tipo-status-usuario';
import { TipoUsuarioSelect } from './classes/select-tipo-usuario';

@Injectable({
  providedIn: 'root'
})
export class MapeamentoEnumService {

  mapearTipoPagamentoDescricao(valorNumerico: number): string {
    switch (valorNumerico) {
      case 0:
        return FormasPagamentoSelect.formasPagamento[0].descricao;
      case 1:
        return FormasPagamentoSelect.formasPagamento[1].descricao;
      case 2:
        return FormasPagamentoSelect.formasPagamento[2].descricao;
      default:
        return '';
    }
  }

  mapearTipoPagamentoId(descricao: string): number {
    switch (descricao) {
      case FormasPagamentoSelect.formasPagamento[0].descricao:
        return 0;
      case FormasPagamentoSelect.formasPagamento[1].descricao:
        return 1;
      case FormasPagamentoSelect.formasPagamento[2].descricao:
        return 2;
      default:
        return 9999;
    }
  }

  mapearTipoContaDescricao(valorNumerico: number): string {
    switch (valorNumerico) {
      case 0:
        return TipoContaSelect.tiposConta[0].descricao;
      case 1:
        return TipoContaSelect.tiposConta[1].descricao;
      case 2:
        return TipoContaSelect.tiposConta[2].descricao;
      default:
        return '';
    }
  }

  mapearTipoContaId(descricao: string): number {
    switch (descricao) {
      case TipoContaSelect.tiposConta[0].descricao:
        return 0;
      case TipoContaSelect.tiposConta[1].descricao:
        return 1;
      case TipoContaSelect.tiposConta[2].descricao:
        return 2;
      default:
        return 9999;
    }
  }

  mapearTipoTerceiroDescricao(valorNumerico: number): string {
    switch (valorNumerico) {
      case 0:
        return TipoTerceiroSelect.tiposTerceiro[0].descricao;
      case 1:
        return TipoTerceiroSelect.tiposTerceiro[1].descricao;
      default:
        return '';
    }
  }

  mapearTipoStatusUsuarioPorId(valorNumerico: number): string {
    switch (valorNumerico) {
      case 0:
        return TipoStatusUsuarioSelect.tiposStatus[0].descricao;
      case 1:
        return TipoStatusUsuarioSelect.tiposStatus[1].descricao;
      case 2:
        return TipoStatusUsuarioSelect.tiposStatus[2].descricao;
      default:
        return 'descricao nao encontrada';
    }
  }

  mapearTipoStatusUsuarioPorDescricao(descricao: string): number {
    switch (descricao) {
      case TipoStatusUsuarioSelect.tiposStatus[0].descricao:
        return 0;
      case TipoStatusUsuarioSelect.tiposStatus[1].descricao:
        return 1;
      case TipoStatusUsuarioSelect.tiposStatus[2].descricao:
        return 2;
      default:
        return 9999;
    }
  }






















  mapearTipoUsuarioPorId(valorNumerico: number): string {
    switch (valorNumerico) {
      case 0:
        return TipoUsuarioSelect.tiposUsuario[0].descricao;
      case 1:
        return TipoUsuarioSelect.tiposUsuario[1].descricao;
      case 2:
        return TipoUsuarioSelect.tiposUsuario[2].descricao;
      case 3:
        return TipoUsuarioSelect.tiposUsuario[3].descricao;
      case 4:
        return TipoUsuarioSelect.tiposUsuario[4].descricao;
      default:
        return 'descricao nao encontrada';
    }
  }

  mapearTipoUsuarioPorDescricao(descricao: string): number {
    switch (descricao) {
      case TipoUsuarioSelect.tiposUsuario[0].descricao:
        return 0;
      case TipoUsuarioSelect.tiposUsuario[1].descricao:
        return 1;
      case TipoUsuarioSelect.tiposUsuario[2].descricao:
        return 2;
      case TipoUsuarioSelect.tiposUsuario[3].descricao:
        return 3;
      case TipoUsuarioSelect.tiposUsuario[4].descricao:
        return 4;
      default:
        return 9999;
    }
  }



}
