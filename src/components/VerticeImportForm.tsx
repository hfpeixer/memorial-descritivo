
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
import { X, Upload, FileInput } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerticeImportFormProps {
  onClose: () => void;
}

interface ImportedRow {
  deVertice: string;
  paraVertice: string;
  longitude: string;
  latitude: string;
  distancia: string;
  confrontanteId: string;
}

const VerticeImportForm: React.FC<VerticeImportFormProps> = ({ onClose }) => {
  const { importVertices, confrontantes, projeto, setProjeto } = useMemorial();
  const { toast } = useToast();
  const [importMethod, setImportMethod] = useState<"csv" | "paste">("paste");
  const [pastedData, setPastedData] = useState("");
  const [fileData, setFileData] = useState<File | null>(null);
  const [importedRows, setImportedRows] = useState<ImportedRow[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    deVertice: 0,
    paraVertice: 1,
    longitude: 2,
    latitude: 3,
    distancia: 4,
    confrontante: 5,
    endereco: 6 // Coluna para endereço
  });
  const [delimiter, setDelimiter] = useState(",");
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [defaultConfrontante, setDefaultConfrontante] = useState("");
  const [detectedAddress, setDetectedAddress] = useState("");
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  
  useEffect(() => {
    if (confrontantes.length > 0) {
      setDefaultConfrontante(confrontantes[0].id);
    }
  }, [confrontantes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileData(e.target.files[0]);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target && typeof evt.target.result === 'string') {
          processCsvData(evt.target.result);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const processCsvData = (data: string) => {
    const lines = data.split(/\r\n|\n/);
    const parsedData: string[][] = [];
    
    lines.forEach(line => {
      if (line.trim()) {
        const values = line.split(delimiter);
        parsedData.push(values);
      }
    });
    
    setPreviewData(parsedData);

    // Tenta detectar endereço se o projeto não tiver endereço
    if (projeto && !projeto.endereco && parsedData.length > 0) {
      // Verificar a coluna do endereço em todas as linhas
      for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].length > columnMapping.endereco) {
          const possibleAddress = parsedData[i][columnMapping.endereco]?.trim();
          if (possibleAddress && possibleAddress.length > 5) {
            setDetectedAddress(possibleAddress);
            setShowAddressAlert(true);
            break;
          }
        }
      }
    }
  };

  const handlePastedDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedData(e.target.value);
    processCsvData(e.target.value);
  };

  const handleColumnMappingChange = (field: keyof typeof columnMapping, value: string) => {
    setColumnMapping({
      ...columnMapping,
      [field]: parseInt(value)
    });
  };

  const handleDelimiterChange = (value: string) => {
    setDelimiter(value);
    if (importMethod === "paste") {
      processCsvData(pastedData);
    } else if (fileData) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target && typeof evt.target.result === 'string') {
          processCsvData(evt.target.result);
        }
      };
      reader.readAsText(fileData);
    }
  };

  const applyDetectedAddress = () => {
    if (projeto && detectedAddress) {
      setProjeto({
        ...projeto,
        endereco: detectedAddress
      });
      
      toast({
        title: "Endereço atualizado",
        description: `O endereço do imóvel foi automaticamente preenchido.`,
      });
      setShowAddressAlert(false);
    }
  };

  const processImport = () => {
    const vertices: Vertice[] = [];
    
    previewData.forEach((row, index) => {
      // Pular a linha de cabeçalho, se houver
      if (index === 0 && previewData.length > 1) return;
      
      // Verificar se a linha tem dados suficientes
      if (row.length > Math.max(columnMapping.deVertice, columnMapping.paraVertice, columnMapping.longitude, columnMapping.latitude)) {
        const confrontanteId = row[columnMapping.confrontante]?.trim() || defaultConfrontante;
        
        const vertice: Vertice = {
          id: uuidv4(),
          deVertice: row[columnMapping.deVertice]?.trim() || "",
          paraVertice: row[columnMapping.paraVertice]?.trim() || "",
          longitude: formatCoordinates(row[columnMapping.longitude]?.trim() || ""),
          latitude: formatCoordinates(row[columnMapping.latitude]?.trim() || ""),
          distancia: parseFloat(row[columnMapping.distancia]?.trim() || "0") || 0,
          confrontanteId: confrontanteId
        };
        
        // Somente adicionar se tiver os dados mínimos necessários
        if (vertice.deVertice && vertice.paraVertice && vertice.longitude && vertice.latitude) {
          vertices.push(vertice);
        }
      }
    });
    
    if (vertices.length > 0) {
      importVertices(vertices);
      
      // Aplicar endereço detectado automaticamente se houver e o endereço do projeto estiver vazio
      if (projeto && !projeto.endereco && detectedAddress) {
        applyDetectedAddress();
      }
      
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Importar Vértices</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddressAlert && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span>
                  Endereço do imóvel detectado nos dados importados: <strong>{detectedAddress}</strong>
                </span>
                <Button onClick={applyDetectedAddress} size="sm" className="whitespace-nowrap">
                  Usar este endereço
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              variant={importMethod === "paste" ? "default" : "outline"} 
              className="flex-1"
              onClick={() => setImportMethod("paste")}
            >
              Copiar e Colar
            </Button>
            <Button 
              variant={importMethod === "csv" ? "default" : "outline"} 
              className="flex-1"
              onClick={() => setImportMethod("csv")}
            >
              Importar Arquivo
            </Button>
          </div>

          <div className="space-y-4">
            {importMethod === "csv" ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Selecione um arquivo CSV ou TXT para importar</p>
                <Input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv,.txt" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" type="button" className="mt-2" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
                {fileData && <p className="mt-2 text-sm">{fileData.name}</p>}
              </div>
            ) : (
              <div>
                <Label htmlFor="paste-data">Cole seus dados aqui (uma linha por vértice):</Label>
                <Textarea
                  id="paste-data"
                  placeholder="V1,V2,00°00'00.0&quot;W,00°00'00.0&quot;S,10.5,Confrontante,Endereço Imóvel"
                  className="h-32 mt-1 font-mono"
                  value={pastedData}
                  onChange={handlePastedDataChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="delimiter">Delimitador:</Label>
              <Select defaultValue={delimiter} onValueChange={handleDelimiterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o delimitador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Vírgula (,)</SelectItem>
                  <SelectItem value=";">Ponto e vírgula (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value=" ">Espaço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Mapeamento de Colunas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="col-from">De Vértice:</Label>
                  <Input 
                    id="col-from"
                    type="number"
                    min="0"
                    value={columnMapping.deVertice}
                    onChange={(e) => handleColumnMappingChange("deVertice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-to">Para Vértice:</Label>
                  <Input 
                    id="col-to"
                    type="number"
                    min="0"
                    value={columnMapping.paraVertice}
                    onChange={(e) => handleColumnMappingChange("paraVertice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-long">Longitude:</Label>
                  <Input 
                    id="col-long"
                    type="number"
                    min="0"
                    value={columnMapping.longitude}
                    onChange={(e) => handleColumnMappingChange("longitude", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-lat">Latitude:</Label>
                  <Input 
                    id="col-lat"
                    type="number"
                    min="0"
                    value={columnMapping.latitude}
                    onChange={(e) => handleColumnMappingChange("latitude", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-dist">Distância:</Label>
                  <Input 
                    id="col-dist"
                    type="number"
                    min="0"
                    value={columnMapping.distancia}
                    onChange={(e) => handleColumnMappingChange("distancia", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-conf">Confrontante:</Label>
                  <Input 
                    id="col-conf"
                    type="number"
                    min="0"
                    value={columnMapping.confrontante}
                    onChange={(e) => handleColumnMappingChange("confrontante", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="col-endereco">Endereço (opcional):</Label>
                  <Input 
                    id="col-endereco"
                    type="number"
                    min="0"
                    value={columnMapping.endereco}
                    onChange={(e) => handleColumnMappingChange("endereco", e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {confrontantes.length > 0 && (
              <div>
                <Label htmlFor="default-confrontante">Confrontante Padrão (para colunas vazias):</Label>
                <Select value={defaultConfrontante} onValueChange={setDefaultConfrontante}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um confrontante padrão" />
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
            )}

            {previewData.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-md font-medium">Visualização dos Dados</h3>
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 border-r border-b text-left">#</th>
                        {previewData[0].map((_, index) => (
                          <th key={index} className="px-2 py-1 border-r border-b text-left">Col {index}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          <td className="px-2 py-1 border-r">{rowIndex}</td>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-2 py-1 border-r truncate max-w-xs">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {previewData.length > 5 && (
                        <tr>
                          <td colSpan={previewData[0].length + 1} className="px-2 py-1 text-center text-gray-500">
                            ... mais {previewData.length - 5} linhas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button 
              onClick={processImport} 
              disabled={previewData.length === 0}
            >
              Importar Vértices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerticeImportForm;
