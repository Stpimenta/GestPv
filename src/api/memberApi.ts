import ibpvApi from "./http"


export interface Member {
  id: number
  nome: string
  email: string
  tokenContribuicao: string
  data_nascimento: string
  role: number
}

export interface MembersResponse {
  items: Member[]
  pages: number
}

export interface MembersQuery {
  page: number
  itensQuantity: number
  nome?: string
  token?: string
}

export const getMembersApi = {
  getUsuarios(query: MembersQuery) {
    return ibpvApi.get<MembersResponse>('/Usuario', {
      params: query
    })
  }
}