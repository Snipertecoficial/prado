import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Loader2, Info } from "lucide-react";
import { PecaPerfil2040, SERVICOS_OPTIONS } from "@/types/product";
import { calcularResumoPedido, formatarPreco } from "@/lib/calculations";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResumoOrcamentoProps {
  pecas: PecaPerfil2040[];
  productVariantId: string;
}

const ResumoOrcamento = ({ pecas, productVariantId }: ResumoOrcamentoProps) => {
  const resumo = calcularResumoPedido(pecas);
  const { addItem, createCheckout, isLoading } = useCartStore();
  const { toast } = useToast();

  const getServicoLabel = (servico: string) => {
    return SERVICOS_OPTIONS.find(s => s.value === servico)?.label || servico;
  };

  const handleAddToCart = async () => {
    try {
      // Validar se todos os campos obrigatórios estão preenchidos
      for (let i = 0; i < pecas.length; i++) {
        const peca = pecas[i];
        
        if (peca.servico !== "sem_servico") {
          if (!peca.detalhesServico?.textoDetalhes || peca.detalhesServico.textoDetalhes.trim() === "") {
            toast({
              title: "Campos obrigatórios",
              description: `Por favor, preencha os detalhes do serviço na Peça #${i + 1}`,
              variant: "destructive",
            });
            return;
          }
        }
      }

      // Adicionar cada peça como um item do carrinho com custom attributes
      pecas.forEach((peca, index) => {
        const servicoLabel = getServicoLabel(peca.servico);
        
        const attributes = [
          { key: `Peça #${index + 1} - Comprimento`, value: `${peca.comprimentoMm} mm` },
          { key: `Peça #${index + 1} - Quantidade`, value: peca.quantidade.toString() },
          { key: `Peça #${index + 1} - Serviço`, value: servicoLabel },
        ];

        if (peca.detalhesServico) {
          if (peca.detalhesServico.tipoDetalhe) {
            attributes.push({
              key: `Peça #${index + 1} - Tipo`,
              value: peca.detalhesServico.tipoDetalhe,
            });
          }
          if (peca.detalhesServico.textoDetalhes) {
            attributes.push({
              key: `Peça #${index + 1} - Detalhes`,
              value: peca.detalhesServico.textoDetalhes,
            });
          }
        }

        addItem({
          variantId: productVariantId,
          quantity: 1,
          attributes,
        });
      });

      await createCheckout();

      toast({
        title: "Sucesso!",
        description: "Redirecionando para o checkout do Shopify...",
      });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pedido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de metros:</span>
            <span className="font-medium">{resumo.totalMetros.toFixed(3)} m</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total do Pedido:</span>
            <span className="text-primary">{formatarPreco(resumo.totalValor)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Tolerância:</strong> Variação de até ±3 mm após corte.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Produto personalizado:</strong> Não aceita devolução/troca exceto vício (Art. 18 CDC).
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Acessórios não inclusos:</strong> Buchas, conectores vendidos separadamente.
            </AlertDescription>
          </Alert>
        </div>

        <Button
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar via Shopify
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Checkout seguro via Shopify
        </p>
      </CardContent>
    </Card>
  );
};

export default ResumoOrcamento;
