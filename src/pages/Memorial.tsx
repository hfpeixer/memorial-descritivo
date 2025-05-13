
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemorial } from "@/contexts/MemorialContext";
import { ArrowRight, FileText, Printer, Download, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ResponsavelTecnicoForm from "@/components/ResponsavelTecnicoForm";
import { useIsMobile } from "@/hooks/use-mobile";

const Memorial = () => {
  const { getMemorialDescritivo, responsavelTecnico } = useMemorial();
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [showResponsavelForm, setShowResponsavelForm] = useState(false);
  const isMobile = useIsMobile();
  
  const memorial = getMemorialDescritivo();

  const handleShowResponsavelForm = () => {
    setShowResponsavelForm(true);
  };
  
  const handleResponsavelFormClose = () => {
    setShowResponsavelForm(false);
  };
  
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
              h1 { text-align: center; font-size: 22px; margin-bottom: 30px; font-weight: bold; }
              h2 { font-size: 16px; margin-top: 30px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              table, th, td { border: 1px solid #ddd; }
              th, td { padding: 8px; text-align: left; }
              th { background-color: #f0f0f0; }
              .header { text-align: center; margin-bottom: 30px; }
              .text-center { text-align: center; }
              .pt-8 { padding-top: 32px; }
              .mt-16 { margin-top: 64px; }
              .mb-8 { margin-bottom: 32px; }
              .flex-column { display: flex; flex-direction: column; align-items: center; }
              .signature-container { 
                display: flex; 
                flex-wrap: wrap; 
                justify-content: space-around; 
                margin-top: 40px; 
              }
              .signature-item { 
                width: 45%; 
                text-align: center; 
                margin-bottom: 30px; 
              }
              .signature-line {
                display: block;
                width: 100%;
                max-width: 250px;
                margin: 0 auto 8px;
                border-bottom: 1px solid #000;
              }
              @media print {
                button { display: none; }
                .new-page { page-break-before: always; }
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

1. Beneficiários:
${memorial.beneficiarios.map(b => `Nome: ${b.nome} - CPF/CNPJ: ${b.documento}`).join('\n')}

2. Identificação do Imóvel:
Endereço: ${memorial.projeto.endereco}
Área: ${memorial.projeto.area} m²
Perímetro: ${memorial.projeto.perimetro} m

3. Época da Medição: ${memorial.projeto.epocaMedicao}

4. Instrumento Utilizado: ${memorial.projeto.instrumentoUtilizado}

5. Sistema Geodésico de Referência: ${memorial.projeto.sistemaGeodesico}

6. Projeção Cartográfica: ${memorial.projeto.projecaoCartografica}

7. Tabela de Coordenadas, Medidas e Confrontações:
${memorial.vertices.map((v, index) => {
  const confrontante = memorial.confrontantes.find(c => c.id === v.confrontanteId);
  return `${index + 1}. De ${v.deVertice} para ${v.paraVertice} - Longitude: ${v.longitude} - Latitude: ${v.latitude} - Distância: ${v.distancia} m - Confrontante: ${confrontante?.nome || ""}`;
}).join('\n')}

${memorial.responsavelTecnico ? 
`DADOS DO RESPONSÁVEL TÉCNICO:
Nome: ${memorial.responsavelTecnico.nome}
Cargo: ${memorial.responsavelTecnico.cargo}
Registro CFT: ${memorial.responsavelTecnico.registroCFT}` : ''}

Data: ${new Date().toLocaleDateString()}
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
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
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
                <h1 className="text-2xl font-bold uppercase mb-2">MEMORIAL DESCRITIVO</h1>
                <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">1. Beneficiário(s)</h2>
              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-left">CPF/CNPJ</th>
                  </tr>
                </thead>
                <tbody>
                  {memorial.beneficiarios.map((beneficiario) => (
                    <tr key={beneficiario.id}>
                      <td className="p-2">{beneficiario.nome}</td>
                      <td className="p-2">{beneficiario.documento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">2. Identificação do Imóvel</h2>
              <table className="w-full border mb-6">
                <tbody>
                  <tr>
                    <th className="w-1/3 text-left p-2 bg-gray-50">Endereço</th>
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
                </tbody>
              </table>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">3. Época da Medição</h2>
              <p className="mb-6">{memorial.projeto.epocaMedicao || "Não informada"}</p>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">4. Instrumento Utilizado</h2>
              <p className="mb-6">{memorial.projeto.instrumentoUtilizado || "Não informado"}</p>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">5. Sistema Geodésico de Referência</h2>
              <p className="mb-6">{memorial.projeto.sistemaGeodesico || "Não informado"}</p>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">6. Projeção Cartográfica</h2>
              <p className="mb-6">{memorial.projeto.projecaoCartografica || "Não informada"}</p>

              <h2 className="text-lg font-semibold border-b pb-2 mb-4">7. Tabela de Coordenadas, Medidas e Confrontações</h2>
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

              {memorial.responsavelTecnico ? (
                <div className="mt-16 pt-8 border-t text-center">
                  <h2 className="text-lg font-semibold mb-4 uppercase">Dados do Responsável Técnico</h2>
                  <p className="mb-2">
                    {memorial.responsavelTecnico.nome}<br />
                    {memorial.responsavelTecnico.cargo}<br />
                    {memorial.responsavelTecnico.registroCFT}
                  </p>
                  <p className="mb-2 h-8">____________________________________________</p>
                </div>
              ) : (
                <div className="mt-8 text-center">
                  <Button onClick={handleShowResponsavelForm} className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Adicionar Responsável Técnico
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-8">
                {/* Assinaturas em duas colunas */}
                <div className="signature-container">
                  <div className="w-full text-center mb-6">
                    <h2 className="text-lg font-semibold mb-4">Assinaturas</h2>
                  </div>
                  
                  {/* Coluna 1 - Beneficiários */}
                  <div className={`${isMobile ? 'w-full' : 'w-[48%]'} space-y-10`}>
                    <h3 className="text-center font-medium border-b pb-2 mb-4">Beneficiários</h3>
                    {memorial.beneficiarios.map((beneficiario) => (
                      <div key={beneficiario.id} className="text-center mb-8">
                        <span className="signature-line py-6 inline-block">&nbsp;</span>
                        <p className="font-semibold">{beneficiario.nome}</p>
                        <p className="text-sm text-gray-500">{beneficiario.documento}</p>
                      </div>
                    ))}
                  </div>

                  {/* Coluna 2 - Confrontantes */}
                  <div className={`${isMobile ? 'w-full' : 'w-[48%]'} space-y-10`}>
                    <h3 className="text-center font-medium border-b pb-2 mb-4">Confrontantes</h3>
                    {memorial.confrontantes.map((confrontante) => (
                      <div key={confrontante.id} className="text-center mb-8">
                        <span className="signature-line py-6 inline-block">&nbsp;</span>
                        <p className="font-semibold">{confrontante.nome}</p>
                        <p className="text-sm text-gray-500">{confrontante.documento}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showResponsavelForm && (
        <ResponsavelTecnicoForm onClose={handleResponsavelFormClose} />
      )}
    </Layout>
  );
};

export default Memorial;
