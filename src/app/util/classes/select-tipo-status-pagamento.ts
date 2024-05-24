export class TipoStatusPagamento{
    public static statusPagamento: { id: number; descricao: string }[] = [
        { id: 0, descricao: 'Pendente de agendamento' },
        { id: 1, descricao: 'Pago' },
        { id: 2, descricao: 'Agendado' },
    ];
}
