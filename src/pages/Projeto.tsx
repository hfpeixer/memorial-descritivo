
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemorial } from "@/contexts/MemorialContext";
import { Projeto as ProjetoType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

const Projeto = () => {
  const { projeto, setProjeto } = useMemorial();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProjetoType>({
    id: "",
    nome: "",
    endereco: "",
    area: 0,
    perimetro: 0,
    epocaMedicao: "",
    instrumentoUtilizado: "",
    sistemaGeodesico: "",
    projecaoCartografica: "",
  });

  useEffect(() => {
    if (projeto) {
      setFormData(projeto);
    } else {
      setFormData({ ...formData, id: uuidv4() });
    }
  }, [projeto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "area" || name === "perimetro") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.nome || !formData.endereco || formData.area <= 0 || formData.perimetro <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setProjeto(formData);
    toast({
      title: "Projeto salvo",
      description: "Informações do projeto foram salvas com sucesso.",
    });
    navigate("/beneficiario");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="page-title">Cadastro de Projeto</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Projeto *</Label>
                  <Input 
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do projeto"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input 
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Área (m²) *</Label>
                  <Input 
                    id="area"
                    name="area"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.area || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="perimetro">Perímetro (m) *</Label>
                  <Input 
                    id="perimetro"
                    name="perimetro"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.perimetro || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="epocaMedicao">Época da Medição</Label>
                  <Input 
                    id="epocaMedicao"
                    name="epocaMedicao"
                    value={formData.epocaMedicao}
                    onChange={handleChange}
                    placeholder="MM/AAAA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instrumentoUtilizado">Instrumento Utilizado</Label>
                  <Input 
                    id="instrumentoUtilizado"
                    name="instrumentoUtilizado"
                    value={formData.instrumentoUtilizado}
                    onChange={handleChange}
                    placeholder="Tipo de instrumento"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sistemaGeodesico">Sistema Geodésico de Referência</Label>
                  <Input 
                    id="sistemaGeodesico"
                    name="sistemaGeodesico"
                    value={formData.sistemaGeodesico}
                    onChange={handleChange}
                    placeholder="Ex: SIRGAS 2000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projecaoCartografica">Projeção Cartográfica</Label>
                  <Input 
                    id="projecaoCartografica"
                    name="projecaoCartografica"
                    value={formData.projecaoCartografica}
                    onChange={handleChange}
                    placeholder="Ex: UTM"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar e Avançar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Projeto;
