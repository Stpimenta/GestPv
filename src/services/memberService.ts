import { getMembersApi } from "@/api"
import type {MembersQuery, MembersResponse, Member} from "@/api"
import { parseAxiosError } from "./helpers/parseAxiosError"

export async function getMembersService(
  query: MembersQuery
): Promise<{ data: MembersResponse | null; error: string | null }> {
  try {
    const { data } = await getMembersApi.getUsuarios(query)
    return { data, error: null }
  } catch (err) {
    return { data: null, error: parseAxiosError(err) }
  }
}

export async function getMemberByToken(token:string):Promise<{ member: Member | null; error: string | null }> {

  try {

    const {data,error} = await getMembersService({itensQuantity:10,page:1,token:token});

    if(error)
    {
      return { member: null, error: error }
    }

    const items = data?.items || []

    if(items.length == 0){
      return { member: null, error: 'Token do membro não encontrado ou inválido' }
    }

     if(items.length > 1){
      return { member: null, error: 'Erro crítico: múltiplos membros com o mesmo token' }
    }


    const member = items[0]!;
    return{member:member, error:null}
    
  } catch (error) {
      return{member:null, error: parseAxiosError(error)}
  }


}