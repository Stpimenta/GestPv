import { defineStore } from "pinia";
import { getWalletsService } from "@/services";
import type { Wallet } from "@/api";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    loading: false,
    error: null as string | null,
    data: [] as Wallet[],
  }),

  actions: {
    async fetchWallets() {
      if (this.loading) return;

      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await getWalletsService();

        if (error) {
          this.error = error;
          this.data = [];
          return;
        }

        if (data) {
          this.data = data;
        }
      } 
      
      catch (error) {
        this.error = "Erro inesperado ao buscar caixas";
      }

      finally{
        this.loading = false
      }
    },

     clearWallets() {
      this.data = [];
      this.error = null;
      this.loading = false;
    },
  },
});
