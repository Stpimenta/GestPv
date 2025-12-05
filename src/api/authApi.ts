import http from "./http.ts"
import type { modelLoginRequest, modelLoginResponse} from "@/models"

export const authApi = {
    login (payload:modelLoginRequest)
    {
        return http.post<modelLoginResponse>("/Login",payload);
    }
}