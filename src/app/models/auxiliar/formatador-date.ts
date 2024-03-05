export class FormatadorData {

    public formatarData(date: string): string {
      const dataAtual = new Date(date);
      const dia = String(dataAtual.getDate()).padStart(2, '0');
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
      const ano = dataAtual.getFullYear();
  
      return `${ano}-${mes}-${dia}`;
    }
  }
  