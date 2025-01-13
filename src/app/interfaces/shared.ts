export type SendResponseResult<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: T | undefined |null;
};
