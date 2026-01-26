import { earnedApi, blockedPeriodsApi } from "../api";
import type {
  EarnedQuery,
  EarnedsResponse,
  EarnedCreate,
  Earned,
  EarnedUpdate,
  EarnedDetail,
  EarnedImage
} from "../api/";
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

export interface EarnedServiceUIUpdate {
  id: number;
  valor: number;
  descricao?: string;
  data: string;
  urlEnvelope?: string;
  idCaixa: number;
  tokenMembro?: string;
  images?: EarnedImage[];
}

export const earnedService = {
  async getEarneds(query: EarnedQuery): Promise<{ data: EarnedsResponse | null; error: string | null }> {
    try {
      const { data } = await earnedApi.getEarneds(query);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async getById(id: number): Promise<{ data: EarnedDetail | null; error: string | null }> {
    try {
      if (!id) return { data: null, error: "ID nulo, contate o desenvolvedor" };
      const { data } = await earnedApi.getById(id);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async create(earned: EarnedServiceUICreate, files?: File[]): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await blockedPeriodsApi.isDateBlocked(earned.data);
      if (response.data.toLowerCase() === "true")
        return { success: false, error: "Período bloqueado para alterações" };

      let idMembro: number | undefined;
      if (earned.tokenMembro) {
        const { member, error } = await getMemberByToken(earned.tokenMembro);
        if (error) return { success: false, error };
        idMembro = member!.id;
      }

      const earnedBackend: EarnedCreate = {
        valor: earned.valor,
        descricao: earned.descricao,
        data: earned.data,
        urlEnvelope: earned.urlEnvelope,
        idCaixa: earned.idCaixa,
        idMembro,
      };

      await earnedApi.create(earnedBackend, files);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async update(
    earned: EarnedServiceUIUpdate,
    oldDate: string,
    newFiles?: File[]
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const oldDateBlocked = (await blockedPeriodsApi.isDateBlocked(oldDate)).data.toLowerCase() === "true";
      const newDateBlocked = (await blockedPeriodsApi.isDateBlocked(earned.data)).data.toLowerCase() === "true";

      if (oldDateBlocked || newDateBlocked)
        return { success: false, error: "Período bloqueado para alterações" };

      let idMembro: number | undefined;
      if (earned.tokenMembro) {
        const { member, error } = await getMemberByToken(earned.tokenMembro);
        if (error) return { success: false, error };
        idMembro = member!.id;
      }

      const earnedBackend: EarnedUpdate = {
        id: earned.id,
        valor: earned.valor,
        descricao: earned.descricao,
        data: earned.data,
        urlEnvelope: earned.urlEnvelope,
        idCaixa: earned.idCaixa,
        idMembro,
        images: earned.images,
      };

      await earnedApi.update(earnedBackend, newFiles);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async delete(earned: Earned): Promise<{ success: boolean; error: string | null }> {
    try {
      const isBlocked = (await blockedPeriodsApi.isDateBlocked(earned.data)).data.toLowerCase() === "true";
      if (isBlocked) return { success: false, error: "Período bloqueado para alterações" };

      await earnedApi.delete(earned.id);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },
};
