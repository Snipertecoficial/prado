import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ShoppingCart } from "lucide-react";
import { PecaPerfil2040, SERVICOS_OPTIONS } from "@/types/product";
import { formatarPreco, calcularResumoPedido } from "@/lib/calculations";

interface ResumoOrcamentoProps {
  pecas: PecaPerfil2040[];
  onAddToCart: () => void;
}

const ResumoOrcamento = ({ pecas, onAddToCart }: ResumoOrcamentoProps) => {
  const { totalMetros, totalValor } = calcularResumoPedido(pecas);

  const getServicoLabel = (servico: string) => {
    return SERVICOS_OPTIONS.find(s => s.value === servico)?.label || servico;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabela de Peças */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Comprimento</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pecas.map((peca, index) => (
                <TableRow key={peca.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div>{peca.comprimentoMm} mm</div>
                      <div className="text-xs text-muted-foreground">
                        {(peca.comprimentoMm / 1000).toFixed(3)}m
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{peca.quantidade}</TableCell>
                  <TableCell className="text-sm">
                    {getServicoLabel(peca.servico)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatarPreco(peca.precoTotalPeca)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totalizadores */}
        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de metros:</span>
            <span className="font-medium">{totalMetros.toFixed(3)} m</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total do Pedido:</span>
            <span className="text-primary">{formatarPreco(totalValor)}</span>
          </div>
        </div>

        {/* Avisos Importantes */}
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Tolerância de fabricação:</strong> Os perfis podem ter variação de até ±3 mm no comprimento final após o corte.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Produto personalizado:</strong> Não aceita devolução ou troca, exceto em caso de vício de produto (Art. 18 do CDC).
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Acessórios não inclusos:</strong> Buchas, porcas T, conectores e demais acessórios devem ser adquiridos separadamente.
            </AlertDescription>
          </Alert>
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <Button 
          className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
          onClick={onAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Adicionar ao Carrinho
        </Button>

        {/* Informações Técnicas */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>Produto:</strong> Perfil Estrutural em Alumínio 20x40 V-Slot Preto - Canal 6</p>
          <p><strong>Material:</strong> Alumínio com pintura eletrostática preta</p>
          <p><strong>Peso:</strong> 0,809 kg/metro</p>
          <p><strong>Canal:</strong> 6 mm (compatível com porcas e acessórios Canal 6)</p>
          <p><strong>Prazo:</strong> Envio em até 2 dias úteis</p>
          <p><strong>Norma:</strong> ABNT NBR 8116 (baseada na ASTM / ANSI H35.2-M)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumoOrcamento;
