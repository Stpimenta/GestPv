import { defineStore } from "pinia";
import {
  earnedService
} from "@/services";
import type {
  EarnedQuery,
  EarnedsResponse,
  Earned,
  EarnedDetail,
} from "@/api";

import type { EarnedServiceUIUpdate } from "@/services/";

import type { EarnedServiceUICreate } from "@/services";

export const useEarnedStore = defineStore("earneds", {
  state: () => ({
    loading: false,
    createLoading: false,
    error: null as string | null,
    data: null as EarnedsResponse | null,
    earnedDetail: null as EarnedDetail | null,
    hasMore: true,
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async fetchEarneds(query: EarnedQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await earnedService.getEarneds({
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

    async createEarned(
      earned: EarnedServiceUICreate,
      files?: File[],
    ): Promise<boolean> {
      this.createLoading = true;
      console.log(files);

      const response = await earnedService.create(earned, files);

      this.createLoading = false;

      if (response.error) {
        this.error = response.error;
        return false;
      }

      return response.success;
    },

    async deleteEarned(earned: Earned) {
      const response = await earnedService.delete(earned);
      console.log(earned);
      if (response.success) {
        if (this.data?.items) {
          this.data.items = this.data.items.filter(
            (item) => item.id !== earned.id,
          );
        }
        return;
      }

      this.error = response.error;
    },

    async fetchEarnedById(id: number): Promise<EarnedDetail | null> {
      this.error = null;
      const { data, error } = await earnedService.getById(id);
      console.log(data);

      if (error || !data) {
        this.error = error ?? "erro ao buscar contribuição";
        this.earnedDetail = null;
        return null;
      }

      this.earnedDetail = data;
      return data;
    },

    async updateEarned(form: EarnedServiceUIUpdate, newFiles?: File[]): Promise<boolean> {
      this.createLoading = true;
      this.error = null;

      const payload: EarnedServiceUIUpdate = {
        id: this.earnedDetail!.id,
        valor: form.valor,
        descricao: form.descricao ?? "",
        data: form.data,
        idCaixa: form.idCaixa,
        tokenMembro: form.tokenMembro,
        urlEnvelope: form.urlEnvelope,
        images: form.images,
      };

      const { success, error } = await earnedService.update(
        payload,
        this.earnedDetail!.data,
        newFiles
      );

      this.createLoading = false;

      if (!success) {
        this.error = error;
        return false;
      }

      return true;
    },
  },
});
