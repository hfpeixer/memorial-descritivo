
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemorial } from "@/contexts/MemorialContext";
import { Confrontante, DirecaoConfrontante } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { formatDocumento } from "@/utils/masks";
import { X } from "lucide-react";

interface ConfrontanteFormProps {
  confrontante?: Confrontante | null;
  onClose: () => void;
}

const direcoes: DirecaoConfrontante[] = ["Frente", "Fundos", "Direita", "Esquerda"];

const ConfrontanteForm: React.FC<ConfrontanteFormProps> = ({ confrontante, onClose }) => {
  const { addConfrontante, updateConfrontante } = useMemorial();
  
  const [formData, setFormData] = useState<Confrontante>({
    id: "",
    nome: "",
    documento: "",
    direcao: "Frente",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
  });

  useEffect(() => {
    if (confrontante) {
      setFormData(confrontante);
    } else {
      setFormData({ ...formData, id: uuidv4() });
    }
  }, [confrontante]);

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

  const handleDirecaoChange = (value: string) => {
    setFormData({
      ...formData,
      direcao: value as DirecaoConfrontante,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confrontante) {
      updateConfrontante(confrontante.id, formData);
    } else {
      addConfrontante(formData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {confrontante ? "Editar Confrontante" : "Novo Confrontante"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
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
                  placeholder="Nome do confrontante"
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
                <Label htmlFor="direcao">Direção *</Label>
                <Select 
                  value={formData.direcao} 
                  onValueChange={handleDirecaoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a direção" />
                  </SelectTrigger>
                  <SelectContent>
                    {direcoes.map((direcao) => (
                      <SelectItem key={direcao} value={direcao}>
                        {direcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {confrontante ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfrontanteForm;
