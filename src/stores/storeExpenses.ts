import { defineStore } from "pinia";
import {
  expenseService,
} from "@/services";
import type {
  Expense,
  ExpenseCreate,
  ExpensesQuery,
  ExpensesResponse,
  ExpenseDetail,
} from "@/api";

export const useExpenseStore = defineStore("expenses", {
  state: () => ({
    loading: false,
    createLoading: false,
    error: null as string | null,
    data: null as ExpensesResponse | null,
    expenseUpdate: null as ExpenseDetail | null,
    hasMore: true,
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async fetchExpenses(query: ExpensesQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await expenseService.getExpenses({
        ...query,
        pageNumber: this.page,
        pageQuantity: this.pageSize,
      });

      if (error || !data) {
        this.error = error ?? "erro inesperado ao buscar gastos";
        return;
      }

      if (!this.data) {
        this.data = data;
      } else {
        this.data.items.push(...data.items);
      }

      if (this.page >= data.pages) {
        this.hasMore = false;
      } else {
        this.page++;
      }

      this.loading = false;
    },

    resetExpenses() {
      this.data = null;
      this.error = null;
      this.page = 1;
      this.hasMore = true;
    },

    async createExpense(expense: ExpenseCreate, images?: File[]): Promise<boolean> {
      this.createLoading = true;
      const response = await expenseService.create(expense, images);
    
      this.createLoading = false;

      if (response.error) {
        this.error = response.error;
        return false;
      }

      return response.success;
    },

    async fetchExpenseById(id: number): Promise<ExpenseDetail| null> {

      this.error = null;
      const { data, error } = await expenseService.getById(id);
 

    if (error) {
        this.error = error ?? "erro ao buscar contribuição";
        this.expenseUpdate = null;
        return null;
      }

      
      this.expenseUpdate = data;
      return data;
    },

    async updateExpense(expense:ExpenseDetail, newImages:File[]): Promise<boolean> {

      this.createLoading = true;

      if (!this.expenseUpdate) {
        this.error =
          "Expense vazia no store ao atualizar, contate o desenvolvedor.";
        return false;
      }

      const payload:ExpenseDetail = {
        id:this.expenseUpdate.id,
        data:expense.data,
        descricao:expense.descricao,
        idCaixa:expense.idCaixa,
        valor:expense.valor,
        numeroFiscal:expense.numeroFiscal,
        urlComprovante:expense.urlComprovante,
        images:expense.images
      }

  

      const { success, error } = await expenseService.update(payload, this.expenseUpdate.data, newImages);
      this.createLoading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },

    async deleteExpense(expense: Expense) {
      const response = await expenseService.delete(expense);

      if (response.success) {
        if (this.data?.items)
          this.data.items = this.data.items.filter(
            (item) => item.id !== expense.id,
          );
        return;
      }
      this.error = response.error;
    },
  },
});
