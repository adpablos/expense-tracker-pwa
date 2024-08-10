// src/utils/dateUtils.ts

import { format, parseISO } from 'date-fns';

// Formato para mostrar fechas en la interfaz de usuario
export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';

/**
 * Convierte una fecha a string en formato ISO 8601.
 * @param date - La fecha a convertir.
 * @returns La fecha en formato ISO 8601 string.
 */
export function dateToString(date: Date): string {
  return date.toISOString();
}

/**
 * Convierte un string ISO 8601 a un objeto Date.
 * @param dateString - El string de fecha en formato ISO 8601.
 * @returns Un objeto Date o null si el string no es válido.
 */
export function stringToDate(dateString: string): Date | null {
  try {
    return parseISO(dateString);
  } catch {
    return null;
  }
}

/**
 * Formatea una fecha para mostrar en la interfaz de usuario.
 * @param date - La fecha a formatear (puede ser Date o string ISO 8601).
 * @returns La fecha formateada como string para mostrar.
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObject = typeof date === 'string' ? stringToDate(date) : date;
  return dateObject ? format(dateObject, DISPLAY_DATE_FORMAT) : '';
}

/**
 * Obtiene la fecha y hora actual en la zona horaria local del usuario.
 * @returns La fecha y hora actual como objeto Date.
 */
export function getCurrentLocalDate(): Date {
  return new Date();
}

/**
 * Crea una fecha con la hora establecida a las 12:00 PM en la zona horaria local del usuario.
 * @param year - El año de la fecha.
 * @param month - El mes de la fecha (1-12).
 * @param day - El día del mes.
 * @returns Un objeto Date con la hora establecida a las 12:00 PM.
 */
export function createLocalNoonDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return date;
}
