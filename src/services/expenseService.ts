import { getExpensesApi, postExpenseApi, deleteExpenseApi} from "../api";
import type { ExpenseCreate, ExpensesQuery, ExpensesResponse } from "../api/expenseApi";
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
    return{data:null, error: parseAxiosError(err)}
  }
}


export async function createExpenseService(expense:ExpenseCreate):Promise<{ success: boolean; error: string | null}>
{
  try {
    await postExpenseApi.createExpense(expense);
    return {success:true, error:null};
  } catch (err) {
    return{success:false, error: parseAxiosError(err)}
  }
}


export async function deleteExpenseService(id: number): Promise<{ success: boolean; error: string | null }> {
  try {
    await deleteExpenseApi.deleteExpense(id);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}