import { EstadoEnvioEnum } from '../types/estadoEnvio.enum';
import { type Domicilio } from './domicilio.entity';
import { EstadoEnvio } from './estadoEnvio.entity';
import { type Usuario } from './usuario.entity';

export const PESO_GRAMOS_MAX = 20000;
const PRECIO_CADA_100_GRAMOS = 500;
export const HORA_INICIO = 8;
export const HORA_FIN = 18;

export class Envio {
  constructor(
    private nroSeguimiento: number,
    private descripcion: string,
    private fecha: Date = new Date(),
    private hora: Date,
    private pesoGramos: number,
    private monto: number = this.calcularMonto(),
    private reserva: boolean = false,
    private estado: EstadoEnvio = new EstadoEnvio(EstadoEnvioEnum.Confirmado, ''),
    private origen: Domicilio,
    private destino: Domicilio,
    private cliente: Usuario
  ) {}

  // Getters
  public getNroSeguimiento(): number {
    return this.nroSeguimiento;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getFecha(): Date {
    return this.fecha;
  }

  public getHora(): Date {
    return this.hora;
  }

  public getPesoGramos(): number {
    return this.pesoGramos;
  }

  public getMonto(): number {
    return this.monto;
  }

  public getReserva(): boolean {
    return this.reserva;
  }

  public getEstado(): EstadoEnvio {
    return this.estado;
  }

  public getOrigen(): Domicilio {
    return this.origen;
  }

  public getDestino(): Domicilio {
    return this.destino;
  }

  public getCliente(): Usuario {
    return this.cliente;
  }

  // Setters
  public setNroSeguimiento(nroSeguimiento: number): void {
    this.nroSeguimiento = nroSeguimiento;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public setFecha(fecha: Date): void {
    this.fecha = fecha;
  }

  public setHora(hora: Date): void {
    this.hora = hora;
  }

  public setPesoGramos(pesoGramos: number): void {
    this.pesoGramos = pesoGramos;
  }

  public setMonto(monto: number): void {
    this.monto = monto;
  }

  public setReserva(reserva: boolean): void {
    this.reserva = reserva;
  }

  public setEstado(estado: EstadoEnvio): void {
    this.estado = estado;
  }

  public setOrigen(origen: Domicilio): void {
    this.origen = origen;
  }

  public setDestino(destino: Domicilio): void {
    this.destino = destino;
  }

  public setCliente(cliente: Usuario): void {
    this.cliente = cliente;
  }

  // Methods
  public calcularMonto(): number {
    return this.pesoGramos * PRECIO_CADA_100_GRAMOS / 100;
  }

  /* - Verificacion del rango horario que viene en el json
   *- Se maneja en UTC porque en el mapper se convierte la hora enviada
    a UTC para poder guardarla en la base de datos
  */
  public verificarRangoHorario(): boolean {
    //const horaArg = this.getArgentinaHour(this.hora);
    const horaArg = 12;
    return horaArg >= HORA_INICIO && horaArg < HORA_FIN;
  }

  /* Si se manda un rango horario valido se verifica que:
    1) Si el envio no es reserva, la fecha y hora de la reserva es la actual (fecha actual por defecto)
    2) Si el envio es reserva, se verifica la fecha:
      - Si la hora actual esta fuera del rango horario, la reserva es para el dia siguiente
      - Si la hora actual esta dentro del rango horario, la reserva es para el mismo dia (fecha actual por defecto)
  */
  public verificarReserva(): void {
    if (!this.reserva) {
      this.hora = this.fecha; // Horario de la fecha actual
      this.hora = new Date(this.hora.setSeconds(0, 0)); // HH:mm:00
      if (!this.verificarRangoHorario()) {
        throw new Error(`El horario de entrega debe ser entre las ${HORA_INICIO} y ${HORA_FIN} horas`);
      }
      return;
    }
    const horaArg = this.getArgentinaHour(this.fecha);
    // Si la hora actual esta fuera del rango horario, la reserva es para el dia siguiente
    if (horaArg < HORA_INICIO || horaArg >= HORA_FIN) {
      this.fecha.setDate(this.fecha.getDate() + 1);
    } else {
      if (this.hora < new Date()) {
        throw new Error('El horario para la reserva ya paso');
      }
    }
  }

  public verificarPesoGramos(): boolean {
    if (this.pesoGramos > PESO_GRAMOS_MAX) {
      return false;
    }
    return true;
  }

  /**
   * Por defecto new Date() devuelve la hora en UTC, por eso se convierte a la hora de Argentina
   * para hacer los calculos correspondientes.
   */
  private getArgentinaHour(date: Date): number {
    const tiempoArg = date.toLocaleTimeString('es-AR',
      {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    const horaArg = Number(tiempoArg.split(':')[0]);
    return horaArg;
  }
}
