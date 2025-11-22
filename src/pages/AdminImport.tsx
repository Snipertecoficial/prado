import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Download,
  AlertCircle
} from "lucide-react";
import { createAdminProduct } from "@/lib/shopify-admin";

interface CSVProduct {
  codigo: string;
  descricao: string;
  preco: string;
  categoria: string;
  tipo: string;
  tags?: string;
  comprimentoMin?: string;
  comprimentoMax?: string;
}

interface ImportStatus {
  total: number;
  processed: number;
  success: number;
  failed: number;
  current: string;
  errors: Array<{ product: string; error: string }>;
}

const AdminImport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);
  const [previewData, setPreviewData] = useState<CSVProduct[]>([]);
  const [categoryMapping, setCategoryMapping] = useState("");

  const parseCSV = (text: string): CSVProduct[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Remove header line
    const headers = lines[0].toLowerCase().split(';').map(h => h.trim());
    const dataLines = lines.slice(1);

    return dataLines.map(line => {
      const values = line.split(';').map(v => v.trim());
      const product: any = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });

      return {
        codigo: product.codigo || product.código || '',
        descricao: product.descricao || product.descrição || product.nome || '',
        preco: product.preco || product.preço || product.valor || '0',
        categoria: product.categoria || '',
        tipo: product.tipo || product.tipo_produto || '',
        tags: product.tags || '',
        comprimentoMin: product.comprimento_min || product.comp_min || '',
        comprimentoMax: product.comprimento_max || product.comp_max || '',
      };
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo CSV válido.",
      });
      return;
    }

    setFile(selectedFile);

    // Preview first 5 rows
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setPreviewData(parsed.slice(0, 5));
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportStatus({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
      current: '',
      errors: [],
    });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const products = parseCSV(text);

        setImportStatus(prev => prev ? { ...prev, total: products.length } : null);

        for (const [index, product] of products.entries()) {
          try {
            setImportStatus(prev => prev ? {
              ...prev,
              processed: index + 1,
              current: product.descricao,
            } : null);

            // Preparar tags
            const tags = [
              product.categoria,
              product.tipo,
              ...(product.tags ? product.tags.split(',').map(t => t.trim()) : []),
            ].filter(Boolean);

            // Criar produto na Shopify
            await createAdminProduct({
              title: product.descricao,
              handle: product.codigo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              descriptionHtml: `
                <p><strong>Código:</strong> ${product.codigo}</p>
                ${product.comprimentoMin ? `<p><strong>Comprimento Mínimo:</strong> ${product.comprimentoMin}mm</p>` : ''}
                ${product.comprimentoMax ? `<p><strong>Comprimento Máximo:</strong> ${product.comprimentoMax}mm</p>` : ''}
              `,
              vendor: "Prado Industrial",
              productType: product.tipo || "Componentes",
              tags: tags,
              status: "ACTIVE",
              price: product.preco.replace(',', '.') || "0",
              options: [{ name: "Comprimento", values: ["Padrão"] }],
            });

            setImportStatus(prev => prev ? {
              ...prev,
              success: prev.success + 1,
            } : null);

          } catch (error) {
            console.error(`Erro ao importar ${product.descricao}:`, error);
            
            setImportStatus(prev => prev ? {
              ...prev,
              failed: prev.failed + 1,
              errors: [
                ...prev.errors,
                {
                  product: product.descricao,
                  error: error instanceof Error ? error.message : 'Erro desconhecido',
                },
              ],
            } : null);
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        toast({
          title: "Importação concluída",
          description: `${importStatus?.success || 0} produtos importados com sucesso.`,
        });
      };

      reader.readAsText(file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `codigo;descricao;preco;categoria;tipo;tags;comprimento_min;comprimento_max
PROD001;Produto Exemplo;99.90;movimentacao-linear;guia;destaque,promocao;100;500`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-importacao.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Importação de Produtos CSV</h1>
            <p className="text-muted-foreground">Importe produtos em massa do CSV para sua loja Shopify</p>
          </div>
        </div>

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Formato do CSV</AlertTitle>
          <AlertDescription>
            O arquivo CSV deve conter as colunas: <strong>codigo</strong>, <strong>descricao</strong>, <strong>preco</strong>, <strong>categoria</strong>, <strong>tipo</strong>.
            Colunas opcionais: <strong>tags</strong>, <strong>comprimento_min</strong>, <strong>comprimento_max</strong>.
            Use ponto e vírgula (;) como separador.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload do Arquivo</CardTitle>
              <CardDescription>Selecione um arquivo CSV para importar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={importing}
                />
              </div>

              {file && (
                <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="category-mapping">Mapeamento de Categorias (opcional)</Label>
                <Textarea
                  id="category-mapping"
                  placeholder="guias-lineares:movimentacao-linear&#10;perfis:perfis-estruturais"
                  value={categoryMapping}
                  onChange={(e) => setCategoryMapping(e.target.value)}
                  disabled={importing}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Formato: categoria_csv:slug_categoria (uma por linha)
                </p>
              </div>

              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Template CSV
              </Button>

              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Iniciar Importação
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Prévia dos Dados</CardTitle>
              <CardDescription>Primeiras 5 linhas do arquivo</CardDescription>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-3">
                  {previewData.map((product, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-1">
                      <p className="font-medium">{product.descricao}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline">{product.codigo}</Badge>
                        <Badge variant="secondary">R$ {product.preco}</Badge>
                        {product.categoria && <Badge>{product.categoria}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum arquivo selecionado
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Import Status */}
        {importStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Status da Importação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{importStatus.processed} / {importStatus.total}</span>
                </div>
                <Progress 
                  value={(importStatus.processed / importStatus.total) * 100} 
                />
              </div>

              {importStatus.current && (
                <p className="text-sm text-muted-foreground">
                  Processando: <strong>{importStatus.current}</strong>
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{importStatus.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-5 w-5" />
                    {importStatus.success}
                  </div>
                  <div className="text-xs text-muted-foreground">Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive flex items-center justify-center gap-1">
                    <XCircle className="h-5 w-5" />
                    {importStatus.failed}
                  </div>
                  <div className="text-xs text-muted-foreground">Falhas</div>
                </div>
              </div>

              {importStatus.errors.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  <h3 className="font-semibold text-sm">Erros:</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {importStatus.errors.map((err, index) => (
                      <Alert key={index} variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm">{err.product}</AlertTitle>
                        <AlertDescription className="text-xs">{err.error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminImport;
