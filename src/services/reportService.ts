import { financialReportApi } from "../api";
import type { FinancialReport } from "../api";
import { parseAxiosError } from "./helpers/parseAxiosError";

export const financialReportService = {

  async getMonthlyReportPdf(walletId: number, year: number, month: number): 
    Promise<{ data: Blob | null; error: string | null }> {
    try {
      const { data } = await financialReportApi.getMonthlyReportPdf(walletId, year, month);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },


  async getMonthlySummaryPdf(year: number, month: number): 
    Promise<{ data: Blob | null; error: string | null }> {
    try {
      const { data } = await financialReportApi.getMonthlySummary(year, month);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },


  async getMonthly(walletId: number, year: number, month: number): 
    Promise<{ data: FinancialReport | null; error: string | null }> {
    try {
      const { data } = await financialReportApi.getMonthly(walletId, year, month);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },
};
