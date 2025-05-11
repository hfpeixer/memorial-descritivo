
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Projeto, Beneficiario, Confrontante, Vertice, MemorialDescritivo } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface MemorialContextType {
  projeto: Projeto | null;
  beneficiario: Beneficiario | null;
  confrontantes: Confrontante[];
  vertices: Vertice[];
  setProjeto: (projeto: Projeto) => void;
  setBeneficiario: (beneficiario: Beneficiario) => void;
  addConfrontante: (confrontante: Confrontante) => void;
  updateConfrontante: (id: string, confrontante: Confrontante) => void;
  removeConfrontante: (id: string) => void;
  getConfrontanteById: (id: string) => Confrontante | undefined;
  addVertice: (vertice: Vertice) => void;
  updateVertice: (id: string, vertice: Vertice) => void;
  removeVertice: (id: string) => void;
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
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [beneficiario, setBeneficiario] = useState<Beneficiario | null>(null);
  const [confrontantes, setConfrontantes] = useState<Confrontante[]>([]);
  const [vertices, setVertices] = useState<Vertice[]>([]);
  const { toast } = useToast();

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const loadedProjeto = localStorage.getItem("memorial_projeto");
    const loadedBeneficiario = localStorage.getItem("memorial_beneficiario");
    const loadedConfrontantes = localStorage.getItem("memorial_confrontantes");
    const loadedVertices = localStorage.getItem("memorial_vertices");

    if (loadedProjeto) setProjeto(JSON.parse(loadedProjeto));
    if (loadedBeneficiario) setBeneficiario(JSON.parse(loadedBeneficiario));
    if (loadedConfrontantes) setConfrontantes(JSON.parse(loadedConfrontantes));
    if (loadedVertices) setVertices(JSON.parse(loadedVertices));
  }, []);

  // Salvar dados no localStorage sempre que forem atualizados
  useEffect(() => {
    if (projeto) localStorage.setItem("memorial_projeto", JSON.stringify(projeto));
    if (beneficiario) localStorage.setItem("memorial_beneficiario", JSON.stringify(beneficiario));
    localStorage.setItem("memorial_confrontantes", JSON.stringify(confrontantes));
    localStorage.setItem("memorial_vertices", JSON.stringify(vertices));
  }, [projeto, beneficiario, confrontantes, vertices]);

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

  const getMemorialDescritivo = (): MemorialDescritivo | null => {
    if (!projeto || !beneficiario || confrontantes.length === 0 || vertices.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados necessários para gerar o memorial descritivo.",
        variant: "destructive",
      });
      return null;
    }

    return {
      projeto,
      beneficiario,
      confrontantes,
      vertices,
    };
  };

  const resetMemorial = () => {
    setProjeto(null);
    setBeneficiario(null);
    setConfrontantes([]);
    setVertices([]);
    localStorage.removeItem("memorial_projeto");
    localStorage.removeItem("memorial_beneficiario");
    localStorage.removeItem("memorial_confrontantes");
    localStorage.removeItem("memorial_vertices");
    toast({
      title: "Memorial resetado",
      description: "Todos os dados do memorial foram apagados.",
    });
  };

  const value = {
    projeto,
    beneficiario,
    confrontantes,
    vertices,
    setProjeto,
    setBeneficiario,
    addConfrontante,
    updateConfrontante,
    removeConfrontante,
    getConfrontanteById,
    addVertice,
    updateVertice,
    removeVertice,
    getMemorialDescritivo,
    resetMemorial,
  };

  return (
    <MemorialContext.Provider value={value}>{children}</MemorialContext.Provider>
  );
};
