import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { PecaPerfil2040, SERVICOS_OPTIONS, COMPRIMENTO_MIN, COMPRIMENTO_MAX, TipoServico } from "@/types/product";
import { calcularPrecoPeca, formatarPreco, validarComprimento, validarQuantidade } from "@/lib/calculations";
import DetalhesServicoFields from "./DetalhesServicoFields";

interface PecaFormProps {
  peca: PecaPerfil2040;
  index: number;
  onUpdate: (peca: PecaPerfil2040) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const PecaForm = ({ peca, index, onUpdate, onRemove, canRemove }: PecaFormProps) => {
  const [comprimento, setComprimento] = useState(peca.comprimentoMm.toString());
  const [quantidade, setQuantidade] = useState(peca.quantidade.toString());
  const [erroComprimento, setErroComprimento] = useState<string>();
  const [erroQuantidade, setErroQuantidade] = useState<string>();

  const handleComprimentoChange = (value: string) => {
    setComprimento(value);
    const num = parseInt(value);
    const validacao = validarComprimento(num);
    
    if (validacao.valido) {
      setErroComprimento(undefined);
      const precoTotal = calcularPrecoPeca(num, parseInt(quantidade), peca.precoPorMetro);
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
      const precoTotal = calcularPrecoPeca(peca.comprimentoMm, num, peca.precoPorMetro);
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
              placeholder={`Entre ${COMPRIMENTO_MIN} e ${COMPRIMENTO_MAX} mm`}
            />
            {comprimentoValido && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Min: {COMPRIMENTO_MIN} mm | Max: {COMPRIMENTO_MAX} mm | Tolerância: ±1 mm (até ±3 mm após corte)
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
            Os serviços de usinagem não possuem custo adicional
          </p>
        </div>

        {/* Detalhes do Serviço */}
        <DetalhesServicoFields
          servico={peca.servico}
          detalhes={peca.detalhesServico}
          onChange={handleDetalhesChange}
        />

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
