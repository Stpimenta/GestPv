import { defineStore } from 'pinia'
import  {getMembersService} from '@/services'
import type { MembersQuery, MembersResponse } from '@/api'

export const useMemberStore = defineStore('members', {
  state: () => ({
    loading: false,
    error: null as string | null,
    data: null as MembersResponse | null,
    hasMore: true,
    page: 1,
    pageSize: 20
  }),

  actions: {
    async fetchMembers(query: MembersQuery) {
      if (this.loading || !this.hasMore) return

      this.loading = true
      this.error = null

      const { data, error } = await getMembersService({
        ...query,
        page: this.page,
        itensQuantity: this.pageSize
      })

      if (error || !data) {
        this.error = error ?? 'erro inesperado ao buscar usuários'
        this.loading = false
        return
      }

      if (!this.data) {
        this.data = data
      } else {
        this.data.items.push(...data.items)
      }

      if (this.page >= data.pages) {
        this.hasMore = false
      } else {
        this.page++
      }

      this.loading = false
    },

    resetMembers() {
      this.data = null
      this.error = null
      this.page = 1
      this.hasMore = true
    }
  }
})
