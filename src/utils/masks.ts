
export const formatCPF = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const digits = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (CPF)
  const cpf = digits.slice(0, 11);
  
  // Adiciona a máscara CPF: 000.000.000-00
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  }
};

export const formatCNPJ = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não numéricos
  const digits = value.replace(/\D/g, '');
  
  // Limita a 14 dígitos (CNPJ)
  const cnpj = digits.slice(0, 14);
  
  // Adiciona a máscara CNPJ: 00.000.000/0000-00
  if (cnpj.length <= 2) {
    return cnpj;
  } else if (cnpj.length <= 5) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  } else if (cnpj.length <= 8) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  } else if (cnpj.length <= 12) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  } else {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
  }
};

export const formatDocumento = (value: string): string => {
  if (!value) return '';
  
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 11) {
    return formatCPF(digits);
  } else {
    return formatCNPJ(digits);
  }
};

export const validateDocumento = (documento: string): boolean => {
  const digits = documento.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // Validação de CPF
    return true; // Uma validação real de CPF seria mais complexa
  } else if (digits.length === 14) {
    // Validação de CNPJ
    return true; // Uma validação real de CNPJ seria mais complexa
  }
  
  return false;
};

export const formatCoordinates = (value: string): string => {
  if (!value) return '';
  
  // Remove caracteres não permitidos para coordenadas
  return value.replace(/[^0-9.\-,°' "NSEWNSEW]/g, '');
};
