import ibpvApi from "./http";
import { formatDateToApi } from "./helpers/dateHelper";

export interface EarnedQuery {
  pageNumber: number;
  pageQuantity: number;
  descricao?: string;
  idCaixa?: number;
  initialDate?: string;
  finalDate?: string;
}

export interface Earned {
  id: number;
  descricao?: string;
  valor: number;
  data: string;
  caixa: string;
  urlEnvelope?: string;
  tokenMembro?: string;
}

export interface EarnedsResponse {
  items: Earned[];
  pages: number;
}

export interface EarnedCreate {
  valor: number;
  descricao?: string;
  data: string;
  urlEnvelope?: string;
  idCaixa: number;
  idMembro?: number;
}

export interface EarnedUpdate {
  id: number;
  valor: number;
  descricao?: string;
  data: string;
  urlEnvelope?: string;
  idCaixa: number;
  idMembro?: number;
  images?: EarnedImage[];
}

export interface EarnedImage {
  id: number;
  url: string;
  presignedUrl: string;
}

export interface EarnedDetail {
  id: number;
  valor: number;
  descricao?: string | null;
  data: string;
  urlEnvelope?: string | null;
  idCaixa: number;
  idMembro?: number;
  tokenMembro?: string;
  images?: EarnedImage[];
}

export const earnedApi = {
  getEarneds(query: EarnedQuery) {
    return ibpvApi.get<EarnedsResponse>("/Contribuicao", { params: query });
  },

  getById(id: number) {
    return ibpvApi.get<EarnedDetail>(`/Contribuicao/${id}`);
  },

  create(earned: EarnedCreate, images?: File[]) {
    const formData = new FormData();

    formData.append("Id", "0");
    formData.append("Valor", earned.valor.toString());
    formData.append("Descricao", earned.descricao ?? "");
    formData.append("Data", formatDateToApi(earned.data));
    formData.append("IdCaixa", earned.idCaixa.toString());
    formData.append("IdMembro", earned.idMembro?.toString() ?? "");
    formData.append("UrlEnvelope", earned.urlEnvelope ?? "");

    if (images?.length) {
      images.forEach((f) => formData.append("images", f));
    }

    return ibpvApi.post("/Contribuicao", formData, {
      headers: { Accept: "text/plain" },
    });
  },

  update(earned: EarnedUpdate, newFiles?: File[]) {
    const formData = new FormData();


    formData.append("Id", earned.id.toString());
    formData.append("Valor", earned.valor.toString());
    formData.append("Descricao", earned.descricao ?? "");
    formData.append("Data", formatDateToApi(earned.data));
    formData.append("IdCaixa", earned.idCaixa.toString());
    formData.append("IdMembro", earned.idMembro?.toString() ?? "");
    formData.append("UrlEnvelope", earned.urlEnvelope ?? "");


    if (earned.images?.length) {
      earned.images.forEach((img) => {
        formData.append("KeepImageIds", img.id.toString());
      });
    }

 
    if (newFiles?.length) {
      newFiles.forEach((file) => {
        formData.append("newImages", file);
      });
    }

    return ibpvApi.put(`/Contribuicao/${earned.id}`, formData, {
      headers: { Accept: "text/plain" },
    });
  },

  delete(id: number) {
    return ibpvApi.delete(`/Contribuicao/${id}`);
  },
};
