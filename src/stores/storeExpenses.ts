import { defineStore } from "pinia";
import { createExpenseService, deleteExpenseService, getExpensesService } from "@/services";
import type { Expense, ExpenseCreate, ExpensesQuery, ExpensesResponse } from "@/api";

export const useExpenseStore = defineStore("expenses", {
  state: () => ({
    loading: false,
    createLoading: false,
    error: null as string | null,
    data: null as ExpensesResponse | null,
    hasMore: true,
    page: 1,
    pageSize:  20,
  }),

  actions: {
    async fetchExpenses(query: ExpensesQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;


      const { data, error } = await getExpensesService({
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

    async createExpense(expense:ExpenseCreate):Promise<boolean> {

      this.createLoading = true
      const response = await createExpenseService(expense);

      this.createLoading = false
      
      if(response.error)
      {
        this.error = response.error;
        return false;
      }
     
      return response.success

    },

    async deleteExpense(expense:Expense) {

      const response = await deleteExpenseService(expense);
      
      if(response.success)
      {
        if(this.data?.items)
          this.data.items = this.data.items.filter(item => item.id !== expense.id);
        return;
      }
      this.error = response.error

    },
  },
});
