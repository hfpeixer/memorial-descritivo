
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { Confrontante } from "@/types";
import { Plus, Pen, Check, ArrowRight } from "lucide-react";
import ConfrontanteForm from "@/components/ConfrontanteForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Confrontantes = () => {
  const { confrontantes, removeConfrontante } = useMemorial();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editingConfrontante, setEditingConfrontante] = useState<Confrontante | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingConfrontante(null);
    setShowForm(true);
  };

  const handleEdit = (confrontante: Confrontante) => {
    setEditingConfrontante(confrontante);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingConfrontante(null);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirmation(null);
    removeConfrontante(id);
  };

  const handleNextStep = () => {
    if (confrontantes.length > 0) {
      navigate("/vertices");
    }
  };

  const getDirecaoClass = (direcao: string) => {
    switch (direcao) {
      case "Frente": return "bg-blue-100 text-blue-700";
      case "Fundos": return "bg-purple-100 text-purple-700";
      case "Direita": return "bg-green-100 text-green-700";
      case "Esquerda": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Confrontantes</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adicionar Confrontante
          </Button>
        </div>
        
        {confrontantes.length === 0 ? (
          <Card className="bg-gray-50 border border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">Nenhum confrontante cadastrado</p>
              <Button onClick={handleAddNew} variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Confrontante
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {confrontantes.map((confrontante) => (
              <Card key={confrontante.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-lg">{confrontante.nome}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDirecaoClass(confrontante.direcao)}`}>
                          {confrontante.direcao}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{confrontante.documento}</div>
                      <div className="text-sm text-gray-600 mt-2">
                        {confrontante.rua}, {confrontante.numero} - {confrontante.bairro}, {confrontante.cidade}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(confrontante)}>
                        <Pen className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteConfirmation(confrontante.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleNextStep} 
                disabled={confrontantes.length === 0}
                className="flex items-center gap-2"
              >
                Próxima Etapa <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {showForm && (
          <ConfrontanteForm
            onClose={handleFormClose}
            confrontante={editingConfrontante}
          />
        )}
        
        <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este confrontante? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteConfirmation && handleDeleteConfirm(deleteConfirmation)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Confrontantes;
