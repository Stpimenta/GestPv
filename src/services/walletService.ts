import { walletApi } from "../api";
import type { Wallet, WalletCreate } from "../api/walletApi";
import { parseAxiosError } from "./helpers/parseAxiosError";

export const walletService = {
  async getAll(): Promise<{ data: Wallet[] | null; error: string | null }> {
    try {
      const { data } = await walletApi.getAll();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async getById(id: number): Promise<{ data: Wallet | null; error: string | null }> {
    try {
      const { data } = await walletApi.getAll(); // A API não tem getById, então podemos filtrar localmente
      const wallet = data.find((w) => w.id === id) ?? null;
      return { data: wallet, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async create(wallet: WalletCreate): Promise<{ success: boolean; error: string | null }> {
    try {
      await walletApi.create(wallet);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async update(wallet: Wallet): Promise<{ success: boolean; error: string | null }> {
    try {
      console.log(wallet);
      const response = await walletApi.update(wallet);
      console.log(response);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },

  async delete(id: number): Promise<{ success: boolean; error: string | null }> {
    try {
      await walletApi.delete(id);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAxiosError(err) };
    }
  },
};
