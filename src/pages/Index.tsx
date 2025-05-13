
import React from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { FileText, Users, MapPin, ArrowRight, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const { projeto, beneficiarios, confrontantes, vertices } = useMemorial();
  const isMobile = useIsMobile();

  const stats = [
    {
      title: "Projeto",
      value: projeto ? "Completo" : "Pendente",
      status: projeto ? "complete" : "pending",
      icon: <FileText className="w-6 h-6" />,
      path: "/projeto",
    },
    {
      title: "Beneficiários",
      value: beneficiarios.length,
      status: beneficiarios.length > 0 ? "complete" : "pending",
      icon: <Users className="w-6 h-6" />,
      path: "/beneficiario",
    },
    {
      title: "Confrontantes",
      value: confrontantes.length,
      status: confrontantes.length > 0 ? "complete" : "pending",
      icon: <ArrowRight className="w-6 h-6" />,
      path: "/confrontantes",
    },
    {
      title: "Vértices",
      value: vertices.length,
      status: vertices.length > 0 ? "complete" : "pending",
      icon: <MapPin className="w-6 h-6" />,
      path: "/vertices",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button 
            onClick={() => navigate("/memorial")} 
            className="flex items-center gap-2"
            disabled={!projeto || beneficiarios.length === 0 || confrontantes.length === 0 || vertices.length === 0}
          >
            <Printer className="w-4 h-4" /> Gerar Memorial
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card 
              key={stat.title}
              className={`hover:shadow-md transition-shadow ${
                stat.status === "complete" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-orange-400"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-1 rounded-full ${
                  stat.status === "complete" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                }`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.status === "complete" ? "Completo" : "Pendente"}
                </p>
              </CardContent>
              <CardFooter className="pt-1">
                <Button onClick={() => navigate(stat.path)} variant="ghost" size="sm" className="w-full justify-center">
                  {stat.status === "complete" ? "Editar" : "Iniciar"} →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {projeto && beneficiarios.length > 0 && confrontantes.length > 0 && vertices.length > 0 ? (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-3 mt-1 w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                  <h3 className="font-bold text-green-700">Memorial pronto para geração</h3>
                  <p className="text-green-600">
                    Todos os dados necessários foram preenchidos. Você já pode gerar o memorial descritivo.
                  </p>
                  <Button 
                    onClick={() => navigate("/memorial")}
                    className="mt-3 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Gerar Memorial
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mr-3 mt-1 w-6 h-6"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <div>
                  <h3 className="font-bold text-orange-700">Dados incompletos</h3>
                  <p className="text-orange-600">
                    Preencha todos os dados necessários para gerar o memorial descritivo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Index;
