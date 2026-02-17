export const formatters = {

  currencyBRL(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  },

  dateBRL(value: string) {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  },
  
};
