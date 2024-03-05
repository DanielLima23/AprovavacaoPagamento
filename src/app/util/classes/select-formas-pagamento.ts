export class FormasPagamentoSelect{
    public static formasPagamento: { id: number; descricao: string }[] = [
        { id: 0, descricao: 'Depósito' },
        { id: 1, descricao: 'Boleto' },
        { id: 2, descricao: 'Débito Automático' },
    ];
}