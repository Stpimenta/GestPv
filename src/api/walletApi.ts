import ibpvApi from "./http";

export interface Wallet {
  id: number;
  nome: string;
  valorTotal: number;
}

export interface WalletCreate {
  id?: number;
  nome: string;
}

export const walletApi = {
  getAll() {
    return ibpvApi.get<Wallet[]>("/Caixa");
  },

  create(wallet: WalletCreate) {
    return ibpvApi.post<Wallet>(
      "/Caixa",
      { nome: wallet.nome, valorTotal: 0 },
      { headers: { "Content-Type": "application/json" } }
    );
  },

  update(wallet: WalletCreate & { id: number }) {
    return ibpvApi.put<Wallet>(
      `/Caixa/${wallet.id}`,
      { nome: wallet.nome },
      { headers: { "Content-Type": "application/json" } }
    );
  },

  delete(id: number) {
    return ibpvApi.delete(`/Caixa/${id}`);
  },
};
