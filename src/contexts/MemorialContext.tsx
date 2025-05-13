import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Projeto, Beneficiario, Confrontante, Vertice, MemorialDescritivo, ResponsavelTecnico } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface MemorialContextType {
  projeto: Projeto | null;
  beneficiarios: Beneficiario[];
  confrontantes: Confrontante[];
  vertices: Vertice[];
  responsavelTecnico: ResponsavelTecnico | null;
  setProjeto: (projeto: Projeto) => void;
  addBeneficiario: (beneficiario: Beneficiario) => void;
  updateBeneficiario: (id: string, beneficiario: Beneficiario) => void;
  removeBeneficiario: (id: string) => void;
  addConfrontante: (confrontante: Confrontante) => void;
  updateConfrontante: (id: string, confrontante: Confrontante) => void;
  removeConfrontante: (id: string) => void;
  getConfrontanteById: (id: string) => Confrontante | undefined;
  addVertice: (vertice: Vertice) => void;
  updateVertice: (id: string, vertice: Vertice) => void;
  removeVertice: (id: string) => void;
  importVertices: (vertices: Vertice[]) => void;
  setResponsavelTecnico: (responsavel: ResponsavelTecnico) => void;
  getMemorialDescritivo: () => MemorialDescritivo | null;
  resetMemorial: () => void;
}

const MemorialContext = createContext<MemorialContextType | undefined>(undefined);

export const useMemorial = () => {
  const context = useContext(MemorialContext);
  if (context === undefined) {
    throw new Error("useMemorial must be used within a MemorialProvider");
  }
  return context;
};

interface MemorialProviderProps {
  children: ReactNode;
}

export const MemorialProvider = ({ children }: MemorialProviderProps) => {
  const [projeto, setProjetoState] = useState<Projeto | null>(null);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [confrontantes, setConfrontantes] = useState<Confrontante[]>([]);
  const [vertices, setVertices] = useState<Vertice[]>([]);
  const [responsavelTecnico, setResponsavelTecnico] = useState<ResponsavelTecnico | null>(null);
  const { toast } = useToast();

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const loadedProjeto = localStorage.getItem("memorial_projeto");
    const loadedBeneficiarios = localStorage.getItem("memorial_beneficiarios");
    const loadedConfrontantes = localStorage.getItem("memorial_confrontantes");
    const loadedVertices = localStorage.getItem("memorial_vertices");
    const loadedResponsavelTecnico = localStorage.getItem("memorial_responsavel_tecnico");

    if (loadedProjeto) setProjetoState(JSON.parse(loadedProjeto));
    if (loadedBeneficiarios) setBeneficiarios(JSON.parse(loadedBeneficiarios));
    if (loadedConfrontantes) setConfrontantes(JSON.parse(loadedConfrontantes));
    if (loadedVertices) setVertices(JSON.parse(loadedVertices));
    if (loadedResponsavelTecnico) setResponsavelTecnico(JSON.parse(loadedResponsavelTecnico));
  }, []);

  // Salvar dados no localStorage sempre que forem atualizados
  useEffect(() => {
    if (projeto) localStorage.setItem("memorial_projeto", JSON.stringify(projeto));
    localStorage.setItem("memorial_beneficiarios", JSON.stringify(beneficiarios));
    localStorage.setItem("memorial_confrontantes", JSON.stringify(confrontantes));
    localStorage.setItem("memorial_vertices", JSON.stringify(vertices));
    if (responsavelTecnico) localStorage.setItem("memorial_responsavel_tecnico", JSON.stringify(responsavelTecnico));
  }, [projeto, beneficiarios, confrontantes, vertices, responsavelTecnico]);

  const addBeneficiario = (beneficiario: Beneficiario) => {
    setBeneficiarios([...beneficiarios, beneficiario]);
    toast({
      title: "Beneficiário adicionado",
      description: `${beneficiario.nome} foi adicionado com sucesso.`,
    });
  };

  const updateBeneficiario = (id: string, beneficiario: Beneficiario) => {
    setBeneficiarios(
      beneficiarios.map((b) => (b.id === id ? beneficiario : b))
    );
    toast({
      title: "Beneficiário atualizado",
      description: `${beneficiario.nome} foi atualizado com sucesso.`,
    });
  };

  const removeBeneficiario = (id: string) => {
    setBeneficiarios(beneficiarios.filter((b) => b.id !== id));
    toast({
      title: "Beneficiário removido",
      description: "Beneficiário foi removido com sucesso.",
    });
  };

  const addConfrontante = (confrontante: Confrontante) => {
    setConfrontantes([...confrontantes, confrontante]);
    toast({
      title: "Confrontante adicionado",
      description: `${confrontante.nome} foi adicionado com sucesso.`,
    });
  };

  const updateConfrontante = (id: string, confrontante: Confrontante) => {
    setConfrontantes(
      confrontantes.map((c) => (c.id === id ? confrontante : c))
    );
    toast({
      title: "Confrontante atualizado",
      description: `${confrontante.nome} foi atualizado com sucesso.`,
    });
  };

  const removeConfrontante = (id: string) => {
    // Verificar se há vértices usando este confrontante
    const hasVertices = vertices.some((v) => v.confrontanteId === id);
    
    if (hasVertices) {
      toast({
        title: "Não foi possível remover",
        description: "Este confrontante está sendo usado em vértices. Remova os vértices primeiro.",
        variant: "destructive",
      });
      return;
    }
    
    setConfrontantes(confrontantes.filter((c) => c.id !== id));
    toast({
      title: "Confrontante removido",
      description: "Confrontante foi removido com sucesso.",
    });
  };

  const getConfrontanteById = (id: string) => {
    return confrontantes.find((c) => c.id === id);
  };

  const addVertice = (vertice: Vertice) => {
    setVertices([...vertices, vertice]);
    toast({
      title: "Vértice adicionado",
      description: `Vértice de ${vertice.deVertice} para ${vertice.paraVertice} foi adicionado.`,
    });
  };

  const updateVertice = (id: string, vertice: Vertice) => {
    setVertices(vertices.map((v) => (v.id === id ? vertice : v)));
    toast({
      title: "Vértice atualizado",
      description: `Vértice foi atualizado com sucesso.`,
    });
  };

  const removeVertice = (id: string) => {
    setVertices(vertices.filter((v) => v.id !== id));
    toast({
      title: "Vértice removido",
      description: "Vértice foi removido com sucesso.",
    });
  };

  const importVertices = (importedVertices: Vertice[]) => {
    setVertices([...vertices, ...importedVertices]);
    toast({
      title: "Vértices importados",
      description: `${importedVertices.length} vértices foram importados com sucesso.`,
    });
  };

  const setProjeto = (newProjeto: Projeto) => {
    setProjetoState(newProjeto);
    localStorage.setItem("memorial_projeto", JSON.stringify(newProjeto));
    toast({
      title: "Projeto atualizado",
      description: "Dados do projeto foram atualizados com sucesso.",
    });
  };

  const getMemorialDescritivo = (): MemorialDescritivo | null => {
    if (!projeto || beneficiarios.length === 0 || confrontantes.length === 0 || vertices.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados necessários para gerar o memorial descritivo.",
        variant: "destructive",
      });
      return null;
    }

    return {
      projeto,
      beneficiarios,
      confrontantes,
      vertices,
      responsavelTecnico
    };
  };

  const resetMemorial = () => {
    setProjetoState(null);
    setBeneficiarios([]);
    setConfrontantes([]);
    setVertices([]);
    setResponsavelTecnico(null);
    localStorage.removeItem("memorial_projeto");
    localStorage.removeItem("memorial_beneficiarios");
    localStorage.removeItem("memorial_confrontantes");
    localStorage.removeItem("memorial_vertices");
    localStorage.removeItem("memorial_responsavel_tecnico");
    toast({
      title: "Memorial resetado",
      description: "Todos os dados do memorial foram apagados.",
    });
  };

  const value = {
    projeto,
    beneficiarios,
    confrontantes,
    vertices,
    responsavelTecnico,
    setProjeto,
    addBeneficiario,
    updateBeneficiario,
    removeBeneficiario,
    addConfrontante,
    updateConfrontante,
    removeConfrontante,
    getConfrontanteById,
    addVertice,
    updateVertice,
    removeVertice,
    importVertices,
    setResponsavelTecnico,
    getMemorialDescritivo,
    resetMemorial,
  };

  return (
    <MemorialContext.Provider value={value}>{children}</MemorialContext.Provider>
  );
};
