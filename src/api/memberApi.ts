import { formatDateToApi } from "./helpers/dateHelper";
import ibpvApi from "./http";

export interface Member {
  id: number;
  nome: string;
  email: string;
  tokenContribuicao: string;
  data_nascimento: string;
  role: number;
}

export interface MembersResponse {
  items: Member[];
  pages: number;
}

export interface MembersQuery {
  page: number;
  itensQuantity: number;
  nome?: string;
  token?: string;
}

export const EnumRole = {
  root: 0,
  admin: 1,
  tesouraria: 2,
  membro: 3,
  pending: 4,
  inativo: 5,
} as const;

export type EnumRole = (typeof EnumRole)[keyof typeof EnumRole];

export const roleMap: Record<EnumRole, string> = {
  [EnumRole.root]: "root",
  [EnumRole.admin]: "admin",
  [EnumRole.tesouraria]: "tesouraria",
  [EnumRole.membro]: "membro",
  [EnumRole.pending]: "pendente",
  [EnumRole.inativo]: "inativo",
};

export interface MemberCreate {
  nome: string;
  email: string;
  senha?: string;
  cpf?: string;
  rgNumero?: string;
  telefone_pais?: string;
  telefoneNumero?: string;

  bairroEdereco: string;
  cidadeEndereco: string;
  ruaEdereco: string;
  cepEndereco: string;
  numeroEndereco: string;
  ufEndereco: string;
  complementoEndereco?: string;

  data_nascimento: string;
  dataBatismo?: string;
  pastorBatismo?: string;
  igrejaBatismo?: string;

  filhos: boolean;
  profissao?: string;
  estadoCivil: string;
  status: number;
  rule: number;
  genero: number;
  alarmAuth?: boolean;
}

export interface MemberUpdate {
  id: number;

  nome: string;
  email: string;

  cpf?: string;
  rgNumero?: string;
  telefone_pais?: string;
  telefoneNumero?: string;

  bairroEdereco: string;
  cidadeEndereco: string;
  ruaEdereco: string;
  cepEndereco: string;
  numeroEndereco: string;
  ufEndereco: string;
  complementoEndereco?: string;

  data_nascimento: string;
  dataBatismo?: string;
  pastorBatismo?: string;
  igrejaBatismo?: string;

  filhos: boolean;
  profissao?: string;
  estadoCivil: string;
  status: number;
  rule: number;
  genero: number;
  alarmAuth?: boolean;
  urlImage: string;
}

export interface MemberDetail {
  id: number;
  nome: string;
  email: string;
  cpf: string | null;
  tokenContribuicao: string;
  rGnumero: string | null;
  telefone_pais: string;
  telefoneNumero: string;
  bairroEdereco: string;
  cidadeEndereco: string;
  ruaEdereco: string;
  cepEndereco: string;
  numeroEndereco: string;
  ufEndereco: string;
  complementoEndereco: string | null;
  data_nascimento: string;
  dataBatismo: string | null;
  pastorBatismo: string | null;
  igrejaBatismo: string | null;
  filhos: boolean;
  profissao: string | null;
  estadoCivil: string;
  active: boolean | null;
  rule: number;
  genero: number;
  urlImage: string;
  alarmAuth: boolean;
}

export const memberApi = {
  getMembers(query: MembersQuery) {
    return ibpvApi.get<MembersResponse>("/Usuario", {
      params: query,
    });
  },

  create(member: MemberCreate, image?: File) {
    const formData = new FormData();

    formData.append("Nome", member.nome);
    formData.append("Email", member.email);
    formData.append("Senha", member.senha ?? "");

    formData.append("Cpf", member.cpf ?? "");
    formData.append("RGnumero", member.rgNumero ?? "");
    formData.append("Telefone_pais", member.telefone_pais ?? "");
    formData.append("TelefoneNumero", member.telefoneNumero ?? "");

    formData.append("BairroEdereco", member.bairroEdereco);
    formData.append("CidadeEndereco", member.cidadeEndereco);
    formData.append("RuaEdereco", member.ruaEdereco);
    formData.append("CepEndereco", member.cepEndereco);
    formData.append("NumeroEndereco", member.numeroEndereco);
    formData.append("UfEndereco", member.ufEndereco);
    formData.append("ComplementoEndereco", member.complementoEndereco ?? "");

    formData.append("Data_nascimento", formatDateToApi(member.data_nascimento));
    formData.append(
      "dataBatismo",
      member.dataBatismo ? formatDateToApi(member.dataBatismo) : "",
    );
    formData.append("pastorBatismo", member.pastorBatismo ?? "");
    formData.append("igrejaBatismo", member.igrejaBatismo ?? "");

    formData.append("filhos", String(member.filhos));
    formData.append("profissao", member.profissao ?? "");
    formData.append("estadoCivil", member.estadoCivil);
    formData.append("status", String(member.status ?? 1));
    formData.append("Rule", member.rule.toString());
    formData.append("genero", member.genero.toString());
    formData.append("alarmAuth", String(member.alarmAuth ?? false));

    if (image) {
      formData.append("Image", image);
    }

    return ibpvApi
      .post("/Usuario", formData, {
        headers: {
          Accept: "text/plain",
        },
      })
      .catch((error) => {
        console.error("Erro ao criar membro:", error);

        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
        }

        throw error;
      });
  },

  update(id: number, member: MemberUpdate, image?: File) {
    const formData = new FormData();

    formData.append("Id", String(id));
    formData.append("Nome", member.nome);
    formData.append("Email", member.email);

    formData.append("Cpf", member.cpf ?? "");
    formData.append("RGnumero", member.rgNumero ?? "");
    formData.append("Telefone_pais", member.telefone_pais ?? "");
    formData.append("TelefoneNumero", member.telefoneNumero ?? "");

    formData.append("BairroEdereco", member.bairroEdereco);
    formData.append("CidadeEndereco", member.cidadeEndereco);
    formData.append("RuaEdereco", member.ruaEdereco);
    formData.append("CepEndereco", member.cepEndereco);
    formData.append("NumeroEndereco", member.numeroEndereco);
    formData.append("UfEndereco", member.ufEndereco);
    formData.append("ComplementoEndereco", member.complementoEndereco ?? "");

    formData.append("Data_nascimento", formatDateToApi(member.data_nascimento));

    formData.append(
      "dataBatismo",
      member.dataBatismo ? formatDateToApi(member.dataBatismo) : "",
    );

    formData.append("pastorBatismo", member.pastorBatismo ?? "");
    formData.append("igrejaBatismo", member.igrejaBatismo ?? "");

    formData.append("filhos", String(member.filhos));
    formData.append("profissao", member.profissao ?? "");
    formData.append("estadoCivil", member.estadoCivil);
    formData.append("status", String(member.status));
    formData.append("Rule", String(member.rule));
    formData.append("genero", String(member.genero));
    formData.append("alarmAuth", String(member.alarmAuth ?? false));

    // importante no update
    if (image) {
      formData.append("Image", image);
    } else {
      formData.append("urlImage", member.urlImage ?? "");
    }

    return ibpvApi.put(`/Usuario/${id}`, formData, {
      headers: {
        Accept: "text/plain",
      },
    });
  },

  getById(id: number) {
    return ibpvApi.get<MemberDetail>(`/Usuario/${id}`, {
      headers: {
        Accept: "text/plain",
      },
    });
  },

  delete(id: number) {
    return ibpvApi.delete<string>(`/Usuario/${id}`, {
      headers: {
        Accept: "text/plain",
      },
    });
  },
  
};
