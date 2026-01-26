import ibpvApi from "./http";
import { formatDateToApi } from "./helpers/dateHelper";

export interface ExpensesQuery {
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

export interface ExpenseDetail {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  urlComprovante?: string | null;
  numeroFiscal?: string | null;
  idCaixa: number;
  images: ExpenseImage[];
}

export interface ExpenseImage {
  id: number;
  url: string;
  presignedUrl: string;
}

export interface ExpensesResponse {
  items: Expense[];
  pages: number;
}

export interface ExpenseCreate {
  valor: number;
  descricao: string;
  data: string;
  urlComprovante?: string;
  numeroFiscal?: string;
  idCaixa: number;
}

export const expenseApi = {
  getExpenses(query: ExpensesQuery) {
    return ibpvApi.get<ExpensesResponse>("/Gasto", { params: query });
  },

  getById(id: Number) {
    return ibpvApi.get(`/Gasto/${id}`);
  },

  create(expense: ExpenseCreate, images?: File[]) {
    const formData = new FormData();

    formData.append("Id", "0");
    formData.append("Valor", expense.valor.toString());
    formData.append("Descricao", expense.descricao);
    formData.append("Data", formatDateToApi(expense.data));
    formData.append("IdCaixa", expense.idCaixa.toString());
    formData.append("UrlComprovante", expense.urlComprovante ?? "");
    formData.append("NumeroFiscal", expense.numeroFiscal ?? "");

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return ibpvApi.post("/Gasto", formData, {
      headers: {
        Accept: "text/plain",
      },
    });
  },

  update(expense: ExpenseDetail, newFiles?: File[]) {
    const formData = new FormData();

    formData.append("Id", expense.id.toString());
    formData.append("Valor", expense.valor.toString());
    formData.append("Descricao", expense.descricao);
    formData.append("Data", formatDateToApi(expense.data));
    formData.append("IdCaixa", expense.idCaixa.toString());
    formData.append("UrlComprovante", expense.urlComprovante ?? "");
    formData.append("NumeroFiscal", expense.numeroFiscal ?? "");

    if (expense.images && expense.images.length > 0) {
      expense.images.forEach((img) => {
        formData.append("KeepImageIds", img.id.toString());
      });
    }

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return ibpvApi.put(`/Gasto/${expense.id}`, formData, {
      headers: {
        Accept: "text/plain",
      },
    });
  },

  delete(id: number) {
    return ibpvApi.delete(`/Gasto/${id}`);
  },
};
