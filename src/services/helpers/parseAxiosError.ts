import type { AxiosError } from "axios";

export function parseAxiosError(err: unknown): string {
  const error = err as AxiosError<any>;
  if (!error.response) return "Serviço indisponível";
  switch (error.response.status) {
    case 400: return error.response.data?.message || "Requisição inválida";
    case 401: return "Não autorizado";
    case 403: return "Acesso negado";
    case 404: return "Recurso não encontrado";
    case 500: return "Erro interno no servidor";
    case 501: return "Funcionalidade não implementada";
    case 503: return "Serviço temporariamente indisponível";
    default:
      return error.response.data?.message || "Erro não identificado, contate o desenvolvedor";
  }
}
