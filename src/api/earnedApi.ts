import ibpvApi from "./http";

export interface EarnedQuery{
  pageNumber: number;
  pageQuantity: number;
  descricao?: string;
  idCaixa?: number;
  initialDate?: string;
  finalDate?: string;
}

export interface Earned{
  id: number;
  descricao: string;
  valor: number;
  data: string;
  caixa: string;
  urlEnvelope?: string;
  tokenMembro?: string;
}

export interface EarnedsResponse {
  items: Earned[]
  pages: number
}

export interface EarnedCreate {
  valor: number;
  descricao?: string;
  data: string;
  urlEnvelope?: string;
  idCaixa: number;
  idMembro?: number;
}

export const getEarnedsApi = {
  getExpenses(query: EarnedQuery) {
    return ibpvApi.get<EarnedsResponse>("/Contribuicao", { params: query });
  },
};

export const postEarnedApi = {
  createExpense(expense:EarnedCreate){
    return ibpvApi.post("/Contribuicao", expense,);
  }
}

export const deleteEarnedApi = {
  deleteExpense(id: number) {
    return ibpvApi.delete(`/Contribuicao/${id}`);
  }
}