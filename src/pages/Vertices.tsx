
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { Vertice } from "@/types";
import { Plus, ArrowRight, MapPin, Pen } from "lucide-react";
import VerticeForm from "@/components/VerticeForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Vertices = () => {
  const { vertices, confrontantes, removeVertice } = useMemorial();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editingVertice, setEditingVertice] = useState<Vertice | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const handleAddNew = () => {
    if (confrontantes.length === 0) {
      alert("É necessário cadastrar pelo menos um confrontante antes de adicionar vértices.");
      navigate("/confrontantes");
      return;
    }
    setEditingVertice(null);
    setShowForm(true);
  };

  const handleEdit = (vertice: Vertice) => {
    setEditingVertice(vertice);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVertice(null);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirmation(null);
    removeVertice(id);
  };

  const handleNextStep = () => {
    if (vertices.length > 0) {
      navigate("/memorial");
    }
  };

  const getConfrontanteNome = (id: string): string => {
    const confrontante = confrontantes.find(c => c.id === id);
    return confrontante ? confrontante.nome : "Desconhecido";
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Vértices</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adicionar Vértice
          </Button>
        </div>
        
        {vertices.length === 0 ? (
          <Card className="bg-gray-50 border border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">Nenhum vértice cadastrado</p>
              <Button onClick={handleAddNew} variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Vértice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border">De</th>
                  <th className="text-left p-3 border">Para</th>
                  <th className="text-left p-3 border">Longitude</th>
                  <th className="text-left p-3 border">Latitude</th>
                  <th className="text-left p-3 border">Distância (m)</th>
                  <th className="text-left p-3 border">Confrontante</th>
                  <th className="text-center p-3 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vertices.map((vertice) => (
                  <tr key={vertice.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{vertice.deVertice}</td>
                    <td className="p-3 border">{vertice.paraVertice}</td>
                    <td className="p-3 border">{vertice.longitude}</td>
                    <td className="p-3 border">{vertice.latitude}</td>
                    <td className="p-3 border">{vertice.distancia}</td>
                    <td className="p-3 border">{getConfrontanteNome(vertice.confrontanteId)}</td>
                    <td className="p-3 border text-center">
                      <div className="flex space-x-2 justify-center">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(vertice)}>
                          <Pen className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteConfirmation(vertice.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleNextStep} 
                className="flex items-center gap-2"
              >
                Gerar Memorial <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {showForm && (
          <VerticeForm
            onClose={handleFormClose}
            vertice={editingVertice}
          />
        )}
        
        <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este vértice? Esta ação não pode ser desfeita.
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

export default Vertices;
