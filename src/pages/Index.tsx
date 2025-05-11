
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { FileText, MapPin, ArrowRight, Check, Info } from "lucide-react";

const Index = () => {
  const { projeto, beneficiario, confrontantes, vertices } = useMemorial();

  const steps = [
    {
      id: "projeto",
      title: "Cadastrar Projeto",
      description: "Informações sobre o projeto e medições",
      path: "/projeto",
      icon: <FileText className="w-5 h-5" />,
      completed: !!projeto,
    },
    {
      id: "beneficiario",
      title: "Cadastrar Beneficiário",
      description: "Dados do beneficiário do memorial",
      path: "/beneficiario",
      icon: <FileText className="w-5 h-5" />,
      completed: !!beneficiario,
    },
    {
      id: "confrontantes",
      title: "Cadastrar Confrontantes",
      description: "Informações sobre os confrontantes",
      path: "/confrontantes",
      icon: <ArrowRight className="w-5 h-5" />,
      completed: confrontantes.length > 0,
    },
    {
      id: "vertices",
      title: "Cadastrar Vértices",
      description: "Coordenadas e distâncias entre vértices",
      path: "/vertices",
      icon: <MapPin className="w-5 h-5" />,
      completed: vertices.length > 0,
    },
    {
      id: "memorial",
      title: "Gerar Memorial",
      description: "Gerar o documento final do memorial",
      path: "/memorial",
      icon: <FileText className="w-5 h-5" />,
      completed: false,
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="page-title">Sistema de Geração de Memorial Descritivo</h1>
        
        <p className="mb-8 text-gray-600">
          Siga os passos abaixo para gerar um memorial descritivo completo. 
          Preencha todas as informações necessárias em cada etapa.
        </p>
        
        <div className="grid gap-6">
          {steps.map((step) => (
            <Card key={step.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${step.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                    {step.completed ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <div>
                    <CardTitle>{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
                {step.completed && <div className="text-green-600 text-sm font-medium">Completo</div>}
              </CardHeader>
              <CardFooter className="pt-2">
                <Link to={step.path}>
                  <Button variant={step.completed ? "outline" : "default"}>
                    {step.completed ? "Editar" : "Iniciar"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-blue-700">Atenção</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">
              Todas as etapas devem estar completas para gerar o memorial descritivo final. 
              As informações são salvas automaticamente no navegador.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
