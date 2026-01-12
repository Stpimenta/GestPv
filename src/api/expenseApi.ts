import ibpvApi from "./http";

export interface ExpensesQuery{
  pageNumber: number;
  pageQuantity: number;
  descricao?: string;
  idCaixa?: number;
  initialDate?: string;
  finalDate?: string;
}


export interface Expense {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  caixa: string;
}

export interface ExpensesResponse {
  items: Expense[]
  pages: number
}

export interface ExpenseCreate {
  valor: number;
  descricao: string;
  data: string;
  urlComprovante?: string;
  numeroFiscal?: string;
  idCaixa: number;
}

export const getExpensesApi = {
  getExpenses(query: ExpensesQuery) {
    return ibpvApi.get<ExpensesResponse>("/Gasto", { params: query });
  },
};

export const postExpenseApi = {
  createExpense(expense:ExpenseCreate){
    return ibpvApi.post("/Gasto", expense,);
  }
}

export const deleteExpenseApi = {
  deleteExpense(id: number) {
    return ibpvApi.delete(`/Gasto/${id}`);
  }
}