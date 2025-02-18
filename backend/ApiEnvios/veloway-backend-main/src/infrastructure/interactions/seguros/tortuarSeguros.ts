import axios from 'axios';

export class TortuarSeguros {
  static async validarSeguro(patente: string): Promise<boolean> {
    try {
      const { data } = await axios.post('https://backtortuar-2.onrender.com/patente', { patente });

      return data;
    } catch (error) {
      return false;
    }
  }
}