import { defineStore } from "pinia";
import { financialReportService } from "@/services";
import type { FinancialReport } from "@/api";

export const useFinancialReportStore = defineStore("financialReport", {
  state: () => ({
    loading: false,
    downloadingLoading: false,
    error: null as string | null,
    data: null as FinancialReport | null,
  }),

  actions: {
    async fetchMonthlyReport(
      walletId: number,
      year: number,
      month: number,
    ): Promise<FinancialReport | null> {
      if (this.loading) return null;

      this.loading = true;
      this.error = null;

      const { data, error } = await financialReportService.getMonthly(
        walletId,
        year,
        month,
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
      this.loading = false;

      if (error) {
        this.error = error;
        this.data = null;
        return null;
      }

      if (data) {
        this.data = data;
        return data;
      }

      this.error = "Erro inesperado ao buscar relatório financeiro";
      return null;
    },

    invertListOrder() {
      if (!this.data?.contributions) return;
      if (!this.data?.expenses) return;

      this.data.contributions = [...this.data.contributions].reverse();
      this.data.expenses = [...this.data.expenses].reverse();
    },

    clearReport() {
      this.data = null;
      this.error = null;
      this.loading = false;
    },

    async fetchMonthlyReportPdf(
      walletId: number,
      year: number,
      month: number,
    ): Promise<Blob | null> {
      if (this.downloadingLoading) return null;

      this.downloadingLoading = true;
      this.error = null;

      const { data, error } = await financialReportService.getMonthlyReportPdf(
        walletId,
        year,
        month,
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
      this.downloadingLoading = false;

      if (error) {
        this.error = error;
        return null;
      }

      return data;
    },

    async fetchMonthlySummaryPdf(
      year: number,
      month: number,
    ): Promise<Blob | null> {
      if (this.downloadingLoading) return null;

      this.downloadingLoading = true;
      this.error = null;

      const { data, error } = await financialReportService.getMonthlySummaryPdf(
        year,
        month,
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
      this.downloadingLoading = false;

      if (error) {
        this.error = error;
        return null;
      }

      return data;
    },
  },
});
