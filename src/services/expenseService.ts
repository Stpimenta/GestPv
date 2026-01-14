import { getExpensesApi, postExpenseApi, deleteExpenseApi,blockedPeriodsApi } from "../api";
import type {
  Expense,
  ExpenseCreate,
  ExpensesQuery,
  ExpensesResponse,
} from "../api/expenseApi";
import { parseAxiosError } from "./helpers/parseAxiosError";
import { boolean, success } from "zod";
import { parse } from "vue/compiler-sfc";

export async function getExpensesService(
  query: ExpensesQuery
): Promise<{ data: ExpensesResponse | null; error: string | null }> {
  try {
    const { data } = await getExpensesApi.getExpenses(query);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: parseAxiosError(err) };
  }
}

export async function createExpenseService(
  expense: ExpenseCreate
): Promise<{ success: boolean; error: string | null }> {
  try {

    const response = await blockedPeriodsApi.isDateBlocked(expense.data);
    const isBlocked = response.data.toLowerCase() == "true";
    if (isBlocked)
      return { success: false, error: "Perido bloqueado para alterações" };

    await postExpenseApi.createExpense(expense);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}

export async function deleteExpenseService(
  expense: Expense
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await blockedPeriodsApi.isDateBlocked(expense.data);
    const isBlocked = response.data.toLowerCase() == "true";
    if (isBlocked)
      return { success: false, error: "Perido bloqueado para alterações" };

    await deleteExpenseApi.deleteExpense(expense.id);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}
