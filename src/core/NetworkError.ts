import { AxiosError } from 'axios';

export type NetworkError =
  | { kind: 'invalidURL' }
  | { kind: 'noConnection' }
  | { kind: 'decodingError' }
  | { kind: 'serverError'; statusCode: number }
  | { kind: 'unknown' };

export const NetworkError = {
  invalidURL: (): NetworkError => ({ kind: 'invalidURL' }),
  noConnection: (): NetworkError => ({ kind: 'noConnection' }),
  decodingError: (): NetworkError => ({ kind: 'decodingError' }),
  serverError: (statusCode: number): NetworkError => ({ kind: 'serverError', statusCode }),
  unknown: (): NetworkError => ({ kind: 'unknown' }),
};

export function isNetworkError(error: unknown): error is NetworkError {
  return typeof error === 'object' && error !== null && 'kind' in error;
}

export function mapAxiosError(error: unknown): NetworkError {
  if (isNetworkError(error)) {
    return error;
  }
  const axiosError = error as AxiosError;
  if (axiosError?.isAxiosError) {
    if (!axiosError.response) {
      return NetworkError.noConnection();
    }
    if (axiosError.response.status) {
      return NetworkError.serverError(axiosError.response.status);
    }
  }
  return NetworkError.unknown();
}

export function userMessage(error: NetworkError): string {
  switch (error.kind) {
    case 'invalidURL':
      return 'La URL solicitada no es válida.';
    case 'noConnection':
      return 'No hay conexión a internet. Verifica tu red e intenta nuevamente.';
    case 'decodingError':
      return 'No se pudo interpretar la respuesta del servidor.';
    case 'serverError':
      return `El servidor respondió con un error (código ${error.statusCode}).`;
    case 'unknown':
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}
