
import { authApi } from "../api";
import type { modelLoginRequest, modelAuthenticated } from "../models";
import type { AxiosError } from "axios";



export async function loginService(
  payload: modelLoginRequest
): Promise<{ data: modelAuthenticated | null; error: string | null }> {
  try {
    const { data } = await authApi.login(payload);

    const decoded = jwtDecode(data.jwtToken);

    const auth: modelAuthenticated = {
      jwt: data.jwtToken,
      sid: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"],
      status: decoded["status"],
      alarmAuth: decoded["alarmAuth"] === "True",
      exp: decoded["exp"],
    };

    return {data:auth, error:null};
  
  } catch (err) {
    const error = err as AxiosError<any>;

    if (error.response?.status === 403)
      return { data: null, error: "Acesso negado" };

    if (error.response?.status === 401)
      return { data: null, error: "Credenciais inválidas" };

    return {
      data: null,
      error:
        error.response?.data?.message || "Erro ao se comunicar com o servidor",
    };
  }
}

export function jwtDecode<T = any>(token: string): T {
  try {
    const parts = token.split(".");
    if (parts.length < 2) throw new Error("Token inválido");

    const payload = parts[1] as string; 
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as T;
  } catch (e) {
    console.error("Erro ao decodificar JWT:", e);
    return {} as T;
  }
}