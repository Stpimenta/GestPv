import { defineStore } from "pinia";
import { memberService } from "@/services";
import type {
  MembersQuery,
  MembersResponse,
  MemberCreate,
  MemberDetail,
  MemberUpdate,
} from "@/api";

export const useMemberStore = defineStore("members", {
  state: () => ({
    loading: false,
    detailsLoading: false,
    memberUpdate: null as MemberDetail | null,
    createLoading: false,
    error: null as string | null,
    data: null as MembersResponse | null,
    hasMore: true,
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async fetchMembers(query: MembersQuery) {
      if (this.loading || !this.hasMore) return;

      this.loading = true;
      this.error = null;

      const { data, error } = await memberService.getMembers({
        ...query,
        page: this.page,
        itensQuantity: this.pageSize,
      });

      if (error || !data) {
        this.error = error ?? "erro inesperado ao buscar membros";
        this.loading = false;
        return;
      }

      if (!this.data) {
        this.data = data;
      } else {
        this.data.items.push(...data.items);
      }

      if (this.page >= data.pages) {
        this.hasMore = false;
      } else {
        this.page++;
      }

      this.loading = false;
    },

    resetMembers() {
      this.data = null;
      this.error = null;
      this.page = 1;
      this.hasMore = true;
    },

    async createMember(member: MemberCreate, image?: File[]): Promise<boolean> {
      this.createLoading = true;

      const file = image && image.length > 0 ? image[0] : undefined;

      const response = await memberService.create(member, file);

      this.createLoading = false;

      if (response.error) {
        this.error = response.error;
        return false;
      }

      return response.success;
    },

    async updateMember(
      member: MemberUpdate,
      newImage?: File[],
    ): Promise<boolean> {
      this.createLoading = true;

      if (!this.memberUpdate) {
        this.error =
          "Membro vazio no store ao atualizar, contate o desenvolvedor.";
        this.createLoading = false;
        return false;
      }

      const file = newImage && newImage.length > 0 ? newImage[0] : undefined;

      const { success, error } = await memberService.update(
        this.memberUpdate.id,
        member,
        file,
      );

      this.createLoading = false;

      if (error) {
        this.error = error;
        return false;
      }

      return success;
    },

    async fetchMemberById(id: number): Promise<MemberDetail | null> {
      this.detailsLoading = true;
      this.error = null;

      const { data, error } = await memberService.getById(id);

      if (error) {
        this.error = error ?? "erro ao buscar membro";
        this.memberUpdate = null;
        this.detailsLoading = false;
        return null;
      }

      this.memberUpdate = data;
      this.detailsLoading = false;

      return data;
    },

    async deleteMember(memberId: number) {
      const response = await memberService.delete(memberId);

      if (response.success) {
        // se tiver lista
        if (this.data) {
          this.data.items = this.data.items.filter((item) => item.id !== memberId);
        }

     
        if (this.data?.items) {
          this.data.items = this.data.items.filter(
            (item) => item.id !== memberId,
          );
        }

        // limpa detalhe se for o mesmo
        if (this.memberUpdate?.id === memberId) {
          this.memberUpdate = null;
        }

        return;
      }

      this.error = response.error;
    },
  },
});
