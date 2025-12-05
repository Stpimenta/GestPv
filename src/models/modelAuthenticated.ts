export interface modelAuthenticated {
  jwt: string;
  sid: string;
  status: EnumRole; 
  alarmAuth: boolean;
  exp: number;
}

export const EnumRole = {
  root: "root",
  admin: "admin",
  tesouraria: "tesouraria",
  membro: "membro",
  pending: "pending",
  inativo: "inativo",
} as const;

export type EnumRole = (typeof EnumRole)[keyof typeof EnumRole];