export const genres = [
    { label: 'Masculino', value: 1 },
    { label: 'Feminino', value: 2 },
];

export const roles = [
    { label: 'Root', value: 0 },
    { label: 'Admin', value: 1 },
    { label: 'Tesouraria', value: 2 },
    { label: 'Membro', value: 3 },
    { label: 'Pending', value: 4 },
    { label: 'Inativo', value: 5 }
];

export const estados = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
];

export const estadosCivis = [
    { label: 'Solteiro', value: 'Solteiro' },
    { label: 'Casado', value: 'Casado' },
    { label: 'Divorciado', value: 'Divorciado' },
    { label: 'Viúvo', value: 'Viuvo' },
    { label: 'União Estável', value: 'UniaoEstavel' }
];

export const paisesTelefone = [
    { label: 'Brasil (+55)', value: '+55' },
    { label: 'Estados Unidos (+1)', value: '+1' },
    { label: 'Portugal (+351)', value: '+351' }
];

export function getLabel(list, value) {
  return list.find(item => item.value == value)?.label ?? "-";
}
