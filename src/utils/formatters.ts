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

  phoneBRL(value: string | number) {
    if (!value) return "-";

    const digits = String(value).replace(/\D/g, "");

    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return value;
  },

  cepBRL(value: string | number) {
  if (!value) return "-";

  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 8) {
    return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return value;
},

  cpf(value: string | number) {
    if (!value) return "-";

    const digits = String(value).replace(/\D/g, "");

    if (digits.length !== 11) return value;

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },

  rg(value: string | number) {
    if (!value) return "-";

    const digits = String(value).replace(/\D/g, "");

    if (digits.length === 9) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    }

    return value;
  },
};
