import { blockedPeriodsApi } from "../api";
import type {
  BlockedPeriodsQuery,
  BlockedPeriodsResponse,
  BlockedPeriodCreate,
} from "../api/periodBlockedApi";
import { parseAxiosError } from "./helpers/parseAxiosError";

export const blockedPeriodsService = {
  async getBlockedPeriods(
    query: BlockedPeriodsQuery,
  ): Promise<{ data: BlockedPeriodsResponse | null; error: string | null }> {
    try {
      const { data } = await blockedPeriodsApi.getBlockedPeriods(query);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async create(
    data: BlockedPeriodCreate,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const startCheck = await blockedPeriodsApi.isDateBlocked(data.startDate);

      if (startCheck.data.toLowerCase() === "true") {
        return { success: false, error: "Data inicial já está bloqueada" };
      }

      const endCheck = await blockedPeriodsApi.isDateBlocked(data.endDate);

      if (endCheck.data.toLowerCase() === "true") {
        return { success: false, error: "Data final já está bloqueada" };
      }

      await blockedPeriodsApi.create(data);

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async requestUnlock(
    blockPeriodId: number,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await blockedPeriodsApi.requestUnlock(blockPeriodId);

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async reblock(
    blockPeriodId: number,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await blockedPeriodsApi.reblock(blockPeriodId);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },
};
