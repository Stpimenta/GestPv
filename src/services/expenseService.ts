import { expenseApi, blockedPeriodsApi } from "../api";
import type { Expense, ExpenseCreate, ExpensesQuery, ExpensesResponse, ExpenseDetail } from "../api/expenseApi";
import { parseAxiosError } from "./helpers/parseAxiosError";

export const expenseService = {
  async getExpenses(query: ExpensesQuery): Promise<{ data: ExpensesResponse | null; error: string | null }> {
    try {
      const { data } = await expenseApi.getExpenses(query);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async getById(id: number): Promise<{ data: ExpenseDetail | null; error: string | null }> {
    try {
      const { data } = await expenseApi.getById(id);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async create(expense: ExpenseCreate, images?: File[]): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await blockedPeriodsApi.isDateBlocked(expense.data);
      if (response.data.toLowerCase() === "true") return { success: false, error: "Período bloqueado para alterações" };
      await expenseApi.create(expense, images);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async update(expense: ExpenseDetail, oldDate: string, newFiles?: File[]): Promise<{ success: boolean; error: string | null }> {
    try {
      const oldDateBlocked = (await blockedPeriodsApi.isDateBlocked(oldDate)).data.toLowerCase() === "true";
      const newDateBlocked = (await blockedPeriodsApi.isDateBlocked(expense.data)).data.toLowerCase() === "true";

      if (oldDateBlocked || newDateBlocked) return { success: false, error: "Período bloqueado para alterações" };

      await expenseApi.update(expense, newFiles);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async delete(expense: Expense): Promise<{ success: boolean; error: string | null }> {
    try {
      const isBlocked = (await blockedPeriodsApi.isDateBlocked(expense.data)).data.toLowerCase() === "true";
      if (isBlocked) return { success: false, error: "Período bloqueado para alterações" };
      await expenseApi.delete(expense.id);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },
};
