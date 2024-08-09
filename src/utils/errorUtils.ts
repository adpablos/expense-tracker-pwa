// src/utils/errorUtils.ts

export function translateErrorMessage(message: string): string {
  if (message.includes('Invalid expense datetime format')) {
    return 'El formato de la fecha y hora del gasto no es válido. Por favor, asegúrate de que la fecha esté en el formato correcto.';
  }
  // add more translations here
  return message; // If there is no translation, return the original message
}
