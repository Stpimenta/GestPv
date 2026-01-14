import ibpvApi from "./http";

export const blockedPeriodsApi = {
  isDateBlocked(date: string) {
    return ibpvApi.get<string>('/BlockedPeriods/is-date-blocked', {
      params: { date },
      responseType: 'text', 
    })
  }
}