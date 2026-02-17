import ibpvApi from "./http";

export interface FinancialReportContribution {
  id: number;
  valor: number;
  descricao: string;
  data: string;
  idCaixa: number;
}

export interface FinancialReportExpense {
  id: number;
  valor: number;
  descricao: string;
  data: string;
}

export interface FinancialReport {
  walletId: number;
  walletName: number;
  year: number;
  month: number;
  balancePreviousMonth: number;
  totalMonthlyContributions: number;
  totalMonthlyExpenses: number;
  balanceAtMonth: number;
  balanceAtNextMonth: number;
  contributions: FinancialReportContribution[];
  expenses: FinancialReportExpense[];
}

export const financialReportApi = {

  getMonthly(walletId: number, year: number, month: number) {
    return ibpvApi.get<FinancialReport>("/financial-report/monthly", {
      params: {
        walletId,
        year,
        month,
      },
    });
  },

  getMonthlyReportPdf(walletId: number, year: number, month: number) {
    return ibpvApi.get("/financial-report/monthly/pdf", {
      params: {
        walletId,
        year,
        month,
      },
      responseType: "blob", 
    });
  },

  getMonthlySummary(year: number, month: number) {
    return ibpvApi.get("/financial-report/monthly/summary/pdf", {
      params: {
        year,
        month,
      },
      responseType: "blob", 
    });
  },

};
