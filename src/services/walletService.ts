import { walletApi } from "@/api";
import type { Wallet } from "@/api";
import { parseAxiosError } from "./helpers/parseAxiosError";

export async function getWalletsService(): Promise<{
  data: Wallet[] | null;
  error: string | null;
}> {
  try {
    const { data } = await walletApi.getAll();
    return { data, error: null };
  } catch (err) {
    return{data:null, error: parseAxiosError(err)}
  }
}
