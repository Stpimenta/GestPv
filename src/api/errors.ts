export const ApiErrorCode = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const;

export type ApiErrorCode =
  (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export function isApiError(
  err: unknown,
  code?: ApiErrorCode
): boolean {
  if (!err || typeof err !== 'object') return false;
  if (!('code' in err)) return false;

  return code ? (err as any).code === code : true;
}

