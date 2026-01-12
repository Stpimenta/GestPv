import { defineStore } from "pinia";
import { loginService } from "../services/index";
import type { modelLoginRequest, modelAuthenticated } from "@/models";

export const userAuthStore = defineStore("login", {
  state: () => ({
    credentials: null as modelAuthenticated | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async login(payload: modelLoginRequest) {
      this.loading = true;
      this.error = null;

      const delay = new Promise((resolve) => setTimeout(resolve, 600));

      const { data, error } = await loginService(payload);

      await delay;

      this.credentials = data;
      this.error = error;

      this.loading = false;
    },

    logout() {
      this.credentials = null;
    },
  },

  persist: {
    pick: ["credentials"],
  },
});
