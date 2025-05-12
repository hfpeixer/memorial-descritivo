
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemorial } from "@/contexts/MemorialContext";
import { ResponsavelTecnico } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";

interface ResponsavelTecnicoFormProps {
  onClose: () => void;
}

const ResponsavelTecnicoForm: React.FC<ResponsavelTecnicoFormProps> = ({ onClose }) => {
  const { responsavelTecnico, setResponsavelTecnico } = useMemorial();
  
  const [formData, setFormData] = useState<ResponsavelTecnico>({
    id: "",
    nome: "",
    cargo: "",
    registroCFT: "",
  });

  useEffect(() => {
    if (responsavelTecnico) {
      setFormData(responsavelTecnico);
    } else {
      setFormData({ ...formData, id: uuidv4() });
    }
  }, [responsavelTecnico]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setResponsavelTecnico(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {responsavelTecnico ? "Editar Responsável Técnico" : "Novo Responsável Técnico"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input 
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome do responsável técnico"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Input 
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Ex: Engenheiro Civil"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="registroCFT">Registro CFT/CREA *</Label>
                <Input 
                  id="registroCFT"
                  name="registroCFT"
                  value={formData.registroCFT}
                  onChange={handleChange}
                  placeholder="Número do registro"
                  required
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
                {responsavelTecnico ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsavelTecnicoForm;
