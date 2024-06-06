export class Util {
  isValidDate(dateString: string): boolean {

    dateString = this.normalizeDate(dateString);
    // Verificar se a data está no formato YYYY-MM-DD (ano com exatamente 4 dígitos)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    // Tentar criar um objeto Date
    const date = new Date(dateString);

    // Verificar se a data é inválida
    if (isNaN(date.getTime())) {
      return false;
    }

    // Verificar se a data fornecida corresponde à data do objeto Date
    // Isso é necessário porque o construtor Date aceita algumas datas inválidas e as corrige.
    const [year, month, day] = dateString.split('-').map(Number);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
      return false;
    }

    return true;
  }

  private normalizeDate(date: string): string {
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    return date;
  }

}
