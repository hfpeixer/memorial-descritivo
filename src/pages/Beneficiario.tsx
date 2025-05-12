
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { Beneficiario as BeneficiarioType } from "@/types";
import { Plus, ArrowRight, UserPlus, Pen } from "lucide-react";
import BeneficiarioForm from "@/components/BeneficiarioForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const Beneficiario = () => {
  const { beneficiarios, removeBeneficiario } = useMemorial();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBeneficiario, setEditingBeneficiario] = useState<BeneficiarioType | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingBeneficiario(null);
    setShowForm(true);
  };

  const handleEdit = (beneficiario: BeneficiarioType) => {
    setEditingBeneficiario(beneficiario);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBeneficiario(null);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteConfirmation(null);
    removeBeneficiario(id);
  };

  const handleNextStep = () => {
    if (beneficiarios.length > 0) {
      navigate("/confrontantes");
    } else {
      toast({
        title: "Dados incompletos",
        description: "Adicione pelo menos um beneficiário antes de prosseguir.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Beneficiários</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Adicionar Beneficiário
          </Button>
        </div>
        
        {beneficiarios.length === 0 ? (
          <Card className="bg-gray-50 border border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">Nenhum beneficiário cadastrado</p>
              <Button onClick={handleAddNew} variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Beneficiário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 border">Nome</th>
                        <th className="text-left p-3 border">CPF/CNPJ</th>
                        <th className="text-left p-3 border">Endereço</th>
                        <th className="text-center p-3 border">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiarios.map((beneficiario) => (
                        <tr key={beneficiario.id} className="hover:bg-gray-50">
                          <td className="p-3 border">{beneficiario.nome}</td>
                          <td className="p-3 border">{beneficiario.documento}</td>
                          <td className="p-3 border">
                            {beneficiario.rua && beneficiario.numero ? 
                              `${beneficiario.rua}, ${beneficiario.numero} - ${beneficiario.bairro}, ${beneficiario.cidade}` : 
                              "Endereço não informado"}
                          </td>
                          <td className="p-3 border text-center">
                            <div className="flex space-x-2 justify-center">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(beneficiario)}>
                                <Pen className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteConfirmation(beneficiario.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-6 space-x-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/projeto")}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="flex items-center gap-2"
              >
                Avançar <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {showForm && (
          <BeneficiarioForm
            onClose={handleFormClose}
            beneficiario={editingBeneficiario}
          />
        )}
        
        <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este beneficiário? Esta ação não pode ser desfeita.
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

export default Beneficiario;
