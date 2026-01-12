import ibpvApi from "./http";

export interface Wallet {
    id:number;
    nome:string;
    valorTotal:number;
}

export const walletApi = {
    getAll (){
        return ibpvApi.get<Wallet[]>("/Caixa");
    }
}