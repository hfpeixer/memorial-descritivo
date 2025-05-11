
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemorial } from "@/contexts/MemorialContext";
import { Beneficiario as BeneficiarioType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { formatDocumento } from "@/utils/masks";
import { useToast } from "@/components/ui/use-toast";

const Beneficiario = () => {
  const { beneficiario, setBeneficiario } = useMemorial();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<BeneficiarioType>({
    id: "",
    nome: "",
    documento: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
  });

  useEffect(() => {
    if (beneficiario) {
      setFormData(beneficiario);
    } else {
      setFormData({ ...formData, id: uuidv4() });
    }
  }, [beneficiario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "documento") {
      setFormData({
        ...formData,
        [name]: formatDocumento(value),
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
    if (!formData.nome || !formData.documento) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e Documento são campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setBeneficiario(formData);
    toast({
      title: "Beneficiário salvo",
      description: "Informações do beneficiário foram salvas com sucesso.",
    });
    navigate("/confrontantes");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="page-title">Cadastro de Beneficiário</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Beneficiário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input 
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do beneficiário"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF / CNPJ *</Label>
                  <Input 
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Digite apenas os números, a formatação é automática
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rua">Rua / Logradouro</Label>
                  <Input 
                    id="rua"
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    placeholder="Nome da rua"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="Nº"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Nome do bairro"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Nome da cidade"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/projeto")}
                >
                  Voltar
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

export default Beneficiario;
