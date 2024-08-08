// src/hooks/useErrorHandler.ts
import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    console.error(message);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};
