import ibpvApi from "./http";

export interface BlockedPeriodsQuery {
  pageNumber: number;
  pageQuantity: number;
  filterDate?: string;
}

export interface PendingUnlock {
  id: number;
  blockPeriodId: number;
  blockUserId: number;
  dateUnlocked: string;
  isActive: boolean;

  blockedUser: {
    id: number;
    nome: string;
  };
}

export interface BlockedPeriod {
  id: number;
  startDate: string;
  endDate: string;
  isBlocked: boolean;
  blockedById: number;
  blockedDate: string;
  description: string;

  blockedBy: {
    id: number;
    nome: string;
    email: string;
    urlImage: string;
  };

  pendingUnlocks: PendingUnlock[] | null;
}

export interface BlockedPeriodsResponse {
  items: BlockedPeriod[];
  pages: number;
}

export interface BlockedPeriodCreate {
  startDate: string;
  endDate: string;
  description: string;
}

export const blockedPeriodsApi = {
  isDateBlocked(date: string) {
    return ibpvApi.get<string>("/BlockedPeriods/is-date-blocked", {
      params: { date },
      responseType: "text",
    });
  },

  getBlockedPeriods(query: BlockedPeriodsQuery) {
    return ibpvApi.get<BlockedPeriodsResponse>("/BlockedPeriods", {
      params: query,
    });
  },

  create(data: BlockedPeriodCreate) {
    return ibpvApi.post<BlockedPeriod>("/BlockedPeriods", data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  requestUnlock(blockPeriodId: number) {
    return ibpvApi.post(
      "/PendingUnlock",
      { blockPeriodId },
      { headers: { "Content-Type": "application/json" } },
    );
  },

  reblock(blockPeriodId: number) {
  return ibpvApi.put(
    `/BlockedPeriods/reblock/${blockPeriodId}`
  );


}
};
