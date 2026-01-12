import { getEarnedsApi, deleteEarnedApi,postEarnedApi } from "../api";
import type { EarnedQuery, EarnedsResponse, EarnedCreate } from "../api/";
import { parseAxiosError } from "./helpers/parseAxiosError";

export async function getEarnedsService(
  query: EarnedQuery
): Promise<{ data: EarnedsResponse | null; error: string | null }> {
  try {
    const { data } = await getEarnedsApi.getExpenses(query);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: parseAxiosError(err) };
  }
}

export async function deleteEarnedService(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    await deleteEarnedApi.deleteExpense(id);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}

export async function createEarnedService(
  earned: EarnedCreate
): Promise<{ success: boolean; error: string | null }> {
  try {
    await postEarnedApi.createExpense(earned);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}