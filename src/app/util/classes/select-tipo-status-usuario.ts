export class TipoStatusUsuarioSelect{
  public static tiposStatus: { id: number; descricao: string }[] = [
      { id: 0, descricao: 'Aguardando aprovação' },
      { id: 1, descricao: 'Aprovado' },
      { id: 2, descricao: 'Bloqueado' },

  ];
}
