import { defineStore } from "pinia";
import { getEarnedsService, deleteEarnedService, createEarnedService } from "@/services";
import type { EarnedQuery, EarnedsResponse, EarnedCreate, Earned } from "@/api";

import type {EarnedServiceUICreate } from "@/services";

export const useEarnedStore = defineStore("earneds", {
  state: () => ({
    loading: false,
    createLoading:false,
    error: null as string | null,
    data: null as EarnedsResponse | null,
    hasMore: true,
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async fetchEarneds(query: EarnedQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await getEarnedsService({
        ...query,
        pageNumber: this.page,
        pageQuantity: this.pageSize,
      });

      if (error || !data) {
        this.error = error ?? "erro inesperado ao buscar contribuições";
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

      this.loading = false;
    },

    resetEarneds() {
      this.data = null;
      this.error = null;
      this.page = 1;
      this.hasMore = true;
    },

    async createEarned(earned: EarnedServiceUICreate): Promise<boolean> {
      this.createLoading = true;

      const response = await createEarnedService(earned);

      this.createLoading = false;

      if (response.error) {
        this.error = response.error;
        return false;
      }

      return response.success;
    },

    async deleteEarned(earned:Earned) {
      const response = await deleteEarnedService(earned);
      console.log(earned)
      if (response.success) {
        if (this.data?.items) {
          this.data.items = this.data.items.filter((item) => item.id !== earned.id);
        }
        return;
      }

      this.error = response.error;
    },
  },
});
