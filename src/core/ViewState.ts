export type ViewState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };

export const ViewState = {
  idle: <T>(): ViewState<T> => ({ status: 'idle' }),
  loading: <T>(): ViewState<T> => ({ status: 'loading' }),
  loaded: <T>(data: T): ViewState<T> => ({ status: 'loaded', data }),
  error: <T>(message: string): ViewState<T> => ({ status: 'error', message }),
};
