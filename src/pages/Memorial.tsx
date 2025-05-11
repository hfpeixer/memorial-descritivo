
import React, { useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { ArrowRight, FileText, Printer, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Memorial = () => {
  const { getMemorialDescritivo, confrontantes } = useMemorial();
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const memorial = getMemorialDescritivo();
  
  if (!memorial) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="page-title">Memorial Descritivo</h1>
          
          <Card className="bg-orange-50 border-orange-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mr-3 mt-1"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <div>
                  <h3 className="font-bold text-orange-700">Dados incompletos</h3>
                  <p className="text-orange-600">
                    Preencha todos os dados necessários para gerar o memorial descritivo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex space-x-4">
            <Button onClick={() => navigate("/projeto")} variant="outline" className="flex-1">
              Iniciar Cadastro
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Memorial Descritivo</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              h1 { text-align: center; font-size: 20px; margin-bottom: 30px; }
              h2 { font-size: 16px; margin-top: 30px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              table, th, td { border: 1px solid #ddd; }
              th, td { padding: 8px; text-align: left; }
              th { background-color: #f0f0f0; }
              .header { text-align: center; margin-bottom: 30px; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Adiciona pequeno atraso para carregar estilos
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    toast({
      title: "Imprimindo memorial",
      description: "A janela de impressão foi aberta.",
    });
  };

  const handleExport = () => {
    if (!memorial) return;
    
    const text = `
MEMORIAL DESCRITIVO

Projeto: ${memorial.projeto.nome}
Endereço: ${memorial.projeto.endereco}
Área: ${memorial.projeto.area} m²
Perímetro: ${memorial.projeto.perimetro} m
Época da Medição: ${memorial.projeto.epocaMedicao}
Instrumento: ${memorial.projeto.instrumentoUtilizado}

BENEFICIÁRIO:
Nome: ${memorial.beneficiario.nome}
Documento: ${memorial.beneficiario.documento}
Endereço: ${memorial.beneficiario.rua}, ${memorial.beneficiario.numero} - ${memorial.beneficiario.bairro}, ${memorial.beneficiario.cidade}

CONFRONTANTES:
${memorial.confrontantes.map(c => `${c.direcao}: ${c.nome} (${c.documento})
Endereço: ${c.rua}, ${c.numero} - ${c.bairro}, ${c.cidade}`).join('\n\n')}

VÉRTICES:
${memorial.vertices.map(v => {
  const confrontante = memorial.confrontantes.find(c => c.id === v.confrontanteId);
  return `De ${v.deVertice} para ${v.paraVertice}
  Longitude: ${v.longitude}
  Latitude: ${v.latitude}
  Distância: ${v.distancia} m
  Confrontante: ${confrontante ? confrontante.nome : ""}`;
}).join('\n\n')}
    `;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memorial_descritivo_${memorial.projeto.nome.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Memorial exportado",
      description: "O arquivo de texto foi baixado com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Memorial Descritivo</h1>
          <div className="flex space-x-2">
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div ref={printRef}>
              <div className="header mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase mb-2">Memorial Descritivo</h1>
                <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">1. Identificação do Imóvel</h2>
              <table className="w-full border mb-6">
                <tbody>
                  <tr>
                    <th className="w-1/3 text-left p-2 bg-gray-50">Nome do Projeto</th>
                    <td className="p-2">{memorial.projeto.nome}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Endereço</th>
                    <td className="p-2">{memorial.projeto.endereco}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Área Total</th>
                    <td className="p-2">{memorial.projeto.area} m²</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Perímetro</th>
                    <td className="p-2">{memorial.projeto.perimetro} m</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Época da Medição</th>
                    <td className="p-2">{memorial.projeto.epocaMedicao}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Instrumento Utilizado</th>
                    <td className="p-2">{memorial.projeto.instrumentoUtilizado}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">2. Identificação do Beneficiário</h2>
              <table className="w-full border mb-6">
                <tbody>
                  <tr>
                    <th className="w-1/3 text-left p-2 bg-gray-50">Nome</th>
                    <td className="p-2">{memorial.beneficiario.nome}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">CPF/CNPJ</th>
                    <td className="p-2">{memorial.beneficiario.documento}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 bg-gray-50">Endereço</th>
                    <td className="p-2">
                      {memorial.beneficiario.rua}, {memorial.beneficiario.numero} - {memorial.beneficiario.bairro}, {memorial.beneficiario.cidade}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">3. Confrontantes</h2>
              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Direção</th>
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-left">Documento</th>
                    <th className="p-2 text-left">Endereço</th>
                  </tr>
                </thead>
                <tbody>
                  {memorial.confrontantes.map((confrontante) => (
                    <tr key={confrontante.id}>
                      <td className="p-2 font-medium">{confrontante.direcao}</td>
                      <td className="p-2">{confrontante.nome}</td>
                      <td className="p-2">{confrontante.documento}</td>
                      <td className="p-2">
                        {confrontante.rua}, {confrontante.numero} - {confrontante.bairro}, {confrontante.cidade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">4. Descrição dos Limites</h2>
              <p className="mb-4">
                O imóvel tem início pelo vértice {memorial.vertices[0]?.deVertice || "-"} e segue com os seguintes pontos:
              </p>

              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">De</th>
                    <th className="p-2 text-left">Para</th>
                    <th className="p-2 text-left">Longitude</th>
                    <th className="p-2 text-left">Latitude</th>
                    <th className="p-2 text-left">Distância</th>
                    <th className="p-2 text-left">Confrontante</th>
                  </tr>
                </thead>
                <tbody>
                  {memorial.vertices.map((vertice) => {
                    const confrontante = memorial.confrontantes.find(c => c.id === vertice.confrontanteId);
                    return (
                      <tr key={vertice.id}>
                        <td className="p-2">{vertice.deVertice}</td>
                        <td className="p-2">{vertice.paraVertice}</td>
                        <td className="p-2">{vertice.longitude}</td>
                        <td className="p-2">{vertice.latitude}</td>
                        <td className="p-2">{vertice.distancia} m</td>
                        <td className="p-2">{confrontante?.nome || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">5. Considerações Finais</h2>
              <p className="mb-6">
                Todas as coordenadas aqui descritas estão georreferenciadas e os azimutes, distâncias e áreas foram calculados com base nas informações levantadas em campo.
              </p>
              
              <div className="mt-16 pt-8 border-t">
                <div className="text-center">
                  <p className="mb-8">____________________________________________</p>
                  <p className="font-semibold">Responsável Técnico</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Memorial;
