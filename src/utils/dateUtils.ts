// src/utils/dateUtils.ts

import { format, parse, isValid, parseISO } from 'date-fns';

// Format for dates to use along the whole application
export const DATE_FORMAT = 'yyyy-MM-dd';

// Converts a date to string using the DATE_FORMAT
export function dateToString(date: Date): string {
  return format(date, DATE_FORMAT);
}

// Converts a string to a Date object assuming the string is in DATE_FORMAT or ISO format
export function stringToDate(dateString: string): Date | null {
  let parsedDate;
  if (dateString.includes('T')) {
    parsedDate = parseISO(dateString);
  } else {
    parsedDate = parse(dateString, DATE_FORMAT, new Date());
  }
  return isValid(parsedDate) ? parsedDate : null;
}

// Formats a date for display
export function formatDateForDisplay(date: Date | string): string {
  const dateObject = typeof date === 'string' ? stringToDate(date) : date;
  return dateObject ? format(dateObject, 'dd/MM/yyyy') : '';
}

// Creates a Date object in UTC
export function createUTCDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

// Gets the current date in UTC
export function getCurrentUTCDate(): Date {
  const now = new Date();
  return createUTCDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}
