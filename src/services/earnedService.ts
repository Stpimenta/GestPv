import { fa, is } from "zod/locales";
import {
  getEarnedsApi,
  deleteEarnedApi,
  postEarnedApi,
  blockedPeriodsApi,
} from "../api";
import type { EarnedQuery, EarnedsResponse, EarnedCreate,Earned } from "../api/";
import { parseAxiosError } from "./helpers/parseAxiosError";
import { getMemberByToken } from "./memberService";

export interface EarnedServiceUICreate {
  valor: number;
  descricao?: string;
  data: string;
  urlEnvelope?: string;
  idCaixa: number;
  tokenMembro: string;
}

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
  earned: Earned
): Promise<{ success: boolean; error: string | null }> {
  try {

    const response = await blockedPeriodsApi.isDateBlocked(earned.data);
    const isBlocked = response.data.toLowerCase() == "true";
    console.log(response );

    if (isBlocked)
      return { success: false, error: "Perido bloqueado para alterações" };

    await deleteEarnedApi.deleteExpense(earned.id);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}

export async function createEarnedService(
  earned: EarnedServiceUICreate
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await blockedPeriodsApi.isDateBlocked(earned.data);
    const isBlocked = response.data.toLowerCase() === "true";

    if (isBlocked)
      return { success: false, error: "Perido bloqueado para alterações" };

    let idMembro: number | undefined
    if (earned.tokenMembro) {
      const { member, error } = await getMemberByToken(earned.tokenMembro);
      if (error) return { success: false, error: error };
    }

    const earnedBackend: EarnedCreate = {
      valor: earned.valor,
      descricao: earned.descricao,
      data: earned.data,
      urlEnvelope: earned.urlEnvelope,
      idCaixa: earned.idCaixa,
      idMembro: idMembro,
    };

    await postEarnedApi.createExpense(earnedBackend);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: parseAxiosError(err) };
  }
}
