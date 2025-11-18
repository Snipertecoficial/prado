import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { PecaPerfil2040, SERVICOS_OPTIONS, TipoServico, ProdutoConfig } from "@/types/product";
import { calcularPrecoPeca, formatarPreco, validarComprimento, validarQuantidade } from "@/lib/calculations";
import DetalhesServicoFields from "./DetalhesServicoFields";

interface PecaFormProps {
  peca: PecaPerfil2040;
  index: number;
  onUpdate: (peca: PecaPerfil2040) => void;
  onRemove: () => void;
  canRemove: boolean;
  produtoConfig?: ProdutoConfig;
}

const PecaForm = ({ peca, index, onUpdate, onRemove, canRemove, produtoConfig }: PecaFormProps) => {
  const [comprimento, setComprimento] = useState(peca.comprimentoMm.toString());
  const [quantidade, setQuantidade] = useState(peca.quantidade.toString());
  const [erroComprimento, setErroComprimento] = useState<string>();
  const [erroQuantidade, setErroQuantidade] = useState<string>();

  const handleComprimentoChange = (value: string) => {
    setComprimento(value);
    const num = parseInt(value);
    const validacao = validarComprimento(num, produtoConfig);
    
    if (validacao.valido) {
      setErroComprimento(undefined);
      const precoPorMetro = produtoConfig?.precoPorMetro || peca.precoPorMetro;
      const precoTotal = calcularPrecoPeca(num, parseInt(quantidade), precoPorMetro, peca.servico);
      onUpdate({
        ...peca,
        comprimentoMm: num,
        precoTotalPeca: precoTotal,
      });
    } else {
      setErroComprimento(validacao.erro);
    }
  };

  const handleQuantidadeChange = (value: string) => {
    setQuantidade(value);
    const num = parseInt(value);
    const validacao = validarQuantidade(num);
    
    if (validacao.valido) {
      setErroQuantidade(undefined);
      const precoPorMetro = produtoConfig?.precoPorMetro || peca.precoPorMetro;
      const precoTotal = calcularPrecoPeca(peca.comprimentoMm, num, precoPorMetro, peca.servico);
      onUpdate({
        ...peca,
        quantidade: num,
        precoTotalPeca: precoTotal,
      });
    } else {
      setErroQuantidade(validacao.erro);
    }
  };

  const handleServicoChange = (value: TipoServico) => {
    onUpdate({
      ...peca,
      servico: value,
      detalhesServico: undefined,
    });
  };

  const handleDetalhesChange = (detalhes: any) => {
    onUpdate({
      ...peca,
      detalhesServico: detalhes,
    });
  };

  // Validar se detalhes são obrigatórios quando serviço != "sem_servico"
  const detalhesObrigatorios = peca.servico !== "sem_servico";
  const detalhesPreenchidos = peca.detalhesServico?.textoDetalhes && peca.detalhesServico.textoDetalhes.trim().length > 0;

  const comprimentoValido = !erroComprimento && comprimento;
  const quantidadeValida = !erroQuantidade && quantidade;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Peça #{index + 1}</CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comprimento */}
        <div className="space-y-2">
          <Label htmlFor={`comprimento-${peca.id}`}>
            Comprimento (mm) *
          </Label>
          <div className="relative">
            <Input
              id={`comprimento-${peca.id}`}
              type="number"
              value={comprimento}
              onChange={(e) => handleComprimentoChange(e.target.value)}
              className={erroComprimento ? "border-destructive" : comprimentoValido ? "border-success" : ""}
              placeholder={`Entre ${produtoConfig?.minComprimentoMm || 1} e ${produtoConfig?.maxComprimentoMm || 3000} mm`}
            />
            {comprimentoValido && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Min: {produtoConfig?.minComprimentoMm || 1} mm | Max: {produtoConfig?.maxComprimentoMm || 3000} mm | Tolerância: {produtoConfig?.toleranciaCorte || "±1 mm (até ±3 mm após corte)"}
          </p>
          {erroComprimento && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erroComprimento}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Quantidade */}
        <div className="space-y-2">
          <Label htmlFor={`quantidade-${peca.id}`}>
            Quantidade *
          </Label>
          <div className="relative">
            <Input
              id={`quantidade-${peca.id}`}
              type="number"
              value={quantidade}
              onChange={(e) => handleQuantidadeChange(e.target.value)}
              className={erroQuantidade ? "border-destructive" : quantidadeValida ? "border-success" : ""}
              placeholder="Mínimo 1 peça"
              min="1"
            />
            {quantidadeValida && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
            )}
          </div>
          {erroQuantidade && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erroQuantidade}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Serviço */}
        <div className="space-y-2">
          <Label htmlFor={`servico-${peca.id}`}>
            Serviço de Usinagem
          </Label>
          <Select value={peca.servico} onValueChange={handleServicoChange}>
            <SelectTrigger id={`servico-${peca.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICOS_OPTIONS.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Serviços listados sem custo adicional. Produto personalizado. Devolução ou trocas de acordo com o art. 18 do CDC.
          </p>
        </div>

        {/* Detalhes do Serviço */}
        <DetalhesServicoFields
          servico={peca.servico}
          detalhes={peca.detalhesServico}
          onChange={handleDetalhesChange}
        />

        {/* Alerta se detalhes obrigatórios não preenchidos */}
        {detalhesObrigatorios && !detalhesPreenchidos && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Por favor, preencha os detalhes do serviço selecionado
            </AlertDescription>
          </Alert>
        )}

        {/* Preço */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Preço desta peça:</span>
            <span className="text-xl font-bold text-primary">
              {formatarPreco(peca.precoTotalPeca)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(peca.comprimentoMm / 1000).toFixed(3)}m × {peca.quantidade} peça(s) × {formatarPreco(peca.precoPorMetro)}/m
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PecaForm;
