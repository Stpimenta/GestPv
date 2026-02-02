import { defineStore } from "pinia";
import { walletService } from "@/services";
import type { Wallet, WalletCreate } from "@/api";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    loading: false,
    createLoading: false,
    walletUpdate: null as Wallet | null,
    error: null as string | null,
    data: [] as Wallet[],
  }),

  actions: {
    async fetchWallets() {
      if (this.loading) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await walletService.getAll();

      if (error) {
        this.error = error;
        this.data = [];
        return;
      }

      if (data) {
        this.data = data;
        this.loading = false;
        return;
      }

      this.error = "Erro inesperado ao buscar caixas";   
    },

    clearWallets() {
      this.data = [];
      this.error = null;
      this.loading = false;
    },

    async fetchWalletById(id: number): Promise<Wallet | null> {
      this.error = null;
      const { data, error } = await walletService.getById(id);

      if (error) {
        this.error = error ?? "Erro ao buscar wallet";
        this.walletUpdate = null;
        return null;
      }

      this.walletUpdate = data;
      return data;
    },

    async createWallet(wallet: WalletCreate): Promise<boolean> {
      this.createLoading = true;
      const response = await walletService.create(wallet);
      this.createLoading = false;

      if (response.error) {
        this.error = response.error;
        return false;
      }

      return response.success;
    },

    async updateWallet(wallet: Wallet): Promise<boolean> {
      if (!this.walletUpdate) {
        this.error =
          "Wallet vazia no store ao atualizar, contate o desenvolvedor.";
        return false;
      }

      this.createLoading = true;

      const payload: Wallet = {
        id: this.walletUpdate.id,
        nome: wallet.nome,
        valorTotal: this.walletUpdate.valorTotal,
      };

      const { success, error } = await walletService.update(payload);
      this.createLoading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },
  },
});
