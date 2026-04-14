import { defineStore } from "pinia";
import { blockedPeriodsService } from "@/services";
import type {
  BlockedPeriodsQuery,
  BlockedPeriodsResponse,
  BlockedPeriodCreate,
} from "@/api";

export const useBlockedPeriodsStore = defineStore("blockedPeriods", {
  state: () => ({
    createLoading: false,
    loading: false,
    error: null as string | null,
    data: null as BlockedPeriodsResponse | null,
    hasMore: true,
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async createBlockedPeriod(payload: BlockedPeriodCreate): Promise<boolean> {
      this.createLoading = true;
      this.error = null;

      const { success, error } = await blockedPeriodsService.create(payload);

      this.createLoading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },

    async fetchBlockedPeriods(query: BlockedPeriodsQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await blockedPeriodsService.getBlockedPeriods({
        ...query,
        pageNumber: this.page,
        pageQuantity: this.pageSize,
      });

      if (error || !data) {
        this.error = error ?? "erro ao buscar períodos bloqueados";
        this.loading = false;
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

      console.log(this.data);

      this.loading = false;
    },

    resetBlockedPeriods() {
      this.data = null;
      this.error = null;
      this.page = 1;
      this.hasMore = true;
    },

    async requestUnlock(blockPeriodId: number): Promise<boolean> {
      this.loading = true;
      this.error = null;

      const { success, error } =
        await blockedPeriodsService.requestUnlock(blockPeriodId);

      this.loading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },

    async reblock(blockPeriodId: number): Promise<boolean> {
      this.loading = true;
      this.error = null;

      const { success, error } =
        await blockedPeriodsService.reblock(blockPeriodId);

      this.loading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },
  },
});
