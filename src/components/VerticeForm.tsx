
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemorial } from "@/contexts/MemorialContext";
import { Vertice } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { formatCoordinates } from "@/utils/masks";
import { X } from "lucide-react";

interface VerticeFormProps {
  vertice?: Vertice | null;
  onClose: () => void;
}

const VerticeForm: React.FC<VerticeFormProps> = ({ vertice, onClose }) => {
  const { addVertice, updateVertice, confrontantes } = useMemorial();
  
  const [formData, setFormData] = useState<Vertice>({
    id: "",
    deVertice: "",
    paraVertice: "",
    longitude: "",
    latitude: "",
    distancia: 0,
    confrontanteId: "",
  });

  useEffect(() => {
    if (vertice) {
      setFormData(vertice);
    } else {
      setFormData({ 
        ...formData, 
        id: uuidv4(),
        confrontanteId: confrontantes.length > 0 ? confrontantes[0].id : "",
      });
    }
  }, [vertice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "longitude" || name === "latitude") {
      setFormData({
        ...formData,
        [name]: formatCoordinates(value),
      });
    } else if (name === "distancia") {
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

  const handleConfrontanteChange = (value: string) => {
    setFormData({
      ...formData,
      confrontanteId: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (vertice) {
      updateVertice(vertice.id, formData);
    } else {
      addVertice(formData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {vertice ? "Editar Vértice" : "Novo Vértice"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deVertice">De Vértice *</Label>
                <Input 
                  id="deVertice"
                  name="deVertice"
                  value={formData.deVertice}
                  onChange={handleChange}
                  placeholder="V1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paraVertice">Para Vértice *</Label>
                <Input 
                  id="paraVertice"
                  name="paraVertice"
                  value={formData.paraVertice}
                  onChange={handleChange}
                  placeholder="V2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input 
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="00°00'00.0&quot;W"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input 
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="00°00'00.0&quot;S"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distancia">Distância (m) *</Label>
                <Input 
                  id="distancia"
                  name="distancia"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.distancia || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confrontanteId">Confrontante *</Label>
                <Select 
                  value={formData.confrontanteId} 
                  onValueChange={handleConfrontanteChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um confrontante" />
                  </SelectTrigger>
                  <SelectContent>
                    {confrontantes.map((confrontante) => (
                      <SelectItem key={confrontante.id} value={confrontante.id}>
                        {confrontante.nome} ({confrontante.direcao})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                {vertice ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerticeForm;
