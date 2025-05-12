
export interface Projeto {
  id: string;
  nome: string;
  endereco: string;
  area: number;
  perimetro: number;
  epocaMedicao: string;
  instrumentoUtilizado: string;
  sistemaGeodesico: string;
  projecaoCartografica: string;
}

export interface Beneficiario {
  id: string;
  nome: string;
  documento: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

export type DirecaoConfrontante = "Frente" | "Fundos" | "Direita" | "Esquerda";

export interface Confrontante {
  id: string;
  nome: string;
  documento: string;
  direcao: DirecaoConfrontante;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

export interface Vertice {
  id: string;
  deVertice: string;
  paraVertice: string;
  longitude: string;
  latitude: string;
  distancia: number;
  confrontanteId: string;
}

export interface ResponsavelTecnico {
  id: string;
  nome: string;
  cargo: string;
  registroCFT: string;
}

export interface MemorialDescritivo {
  projeto: Projeto;
  beneficiarios: Beneficiario[];
  confrontantes: Confrontante[];
  vertices: Vertice[];
  responsavelTecnico: ResponsavelTecnico | null;
}
