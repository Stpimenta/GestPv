import { memberApi } from "@/api";
import type {
  MembersQuery,
  MembersResponse,
  Member,
  MemberCreate,
  MemberDetail,
  MemberUpdate,
} from "@/api";
import { parseAxiosError } from "./helpers/parseAxiosError";
import axios from "axios";

export const memberService = {
  async getMembers(
    query: MembersQuery,
  ): Promise<{ data: MembersResponse | null; error: string | null }> {
    try {
      const { data } = await memberApi.getMembers(query);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async getByToken(
    token: string,
  ): Promise<{ data: Member | null; error: string | null }> {
    try {
      const { data, error } = await this.getMembers({
        page: 1,
        itensQuantity: 10,
        token,
      });

      if (error) {
        return { data: null, error };
      }

      const items = data?.items ?? [];

      if (items.length === 0) {
        return {
          data: null,
          error: "Token do membro não encontrado ou inválido",
        };
      }

      if (items.length > 1) {
        return {
          data: null,
          error: "Erro crítico: múltiplos membros com o mesmo token",
        };
      }

      return { data: items[0]!, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },

  async create(
    member: MemberCreate,
    image?: File,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await memberApi.create(member, image);

      return {
        success: true,
        error: null,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const response = err.response;

        if (response?.data?.title === "Email already exists") {
          return {
            success: false,
            error: "Já existe um usuário com esse email",
          };
        }

        return {
          success: false,
          error: parseAxiosError(err),
        };
      }


      return {
        success: false,
        error: "Erro Desconhecido",
      };
    }
  },

  async update(
    id: number,
    member: MemberUpdate,
    image?: File,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await memberApi.update(id, member, image);

      return {
        success: true,
        error: null,
      };
    } 

    catch (err) {
      if (axios.isAxiosError(err)) {
        const response = err.response;

        if (response?.data?.title === "Email already exists") {
          return {
            success: false,
            error: "Já existe um usuário com esse email",
          };
        }

        return {
          success: false,
          error: parseAxiosError(err),
        };
      }


      return {
        success: false,
        error: "Erro Desconhecido",
      };
    }
    
  },

  async getById(
    id: number,
  ): Promise<{ data: MemberDetail | null; error: string | null }> {
    try {
      const response = await memberApi.getById(id);
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: parseAxiosError(err) };
    }
  },
};
