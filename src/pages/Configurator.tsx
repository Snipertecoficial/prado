import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { PecaPerfil2040, PRECO_POR_METRO_DEFAULT } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PecaForm from "@/components/configurator/PecaForm";
import ResumoOrcamento from "@/components/configurator/ResumoOrcamento";

const Configurator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pecas, setPecas] = useState<PecaPerfil2040[]>([
    {
      id: crypto.randomUUID(),
      comprimentoMm: 500,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: PRECO_POR_METRO_DEFAULT,
      precoTotalPeca: 49.5,
    },
  ]);

  const adicionarPeca = () => {
    const novaPeca: PecaPerfil2040 = {
      id: crypto.randomUUID(),
      comprimentoMm: 500,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: PRECO_POR_METRO_DEFAULT,
      precoTotalPeca: 49.5,
    };
    setPecas([...pecas, novaPeca]);
  };

  const atualizarPeca = (index: number, pecaAtualizada: PecaPerfil2040) => {
    const novasPecas = [...pecas];
    novasPecas[index] = pecaAtualizada;
    setPecas(novasPecas);
  };

  const removerPeca = (index: number) => {
    if (pecas.length > 1) {
      setPecas(pecas.filter((_, i) => i !== index));
    }
  };

  // ID do variant do produto no Shopify (criado automaticamente)
  const PRODUCT_VARIANT_ID = "gid://shopify/ProductVariant/51350863446327";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb / Navigation */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configurador de Perfil Estrutural
          </h1>
          <p className="text-muted-foreground">
            Perfil Estrutural em Alumínio 20x40 V-Slot Preto - Canal 6
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Código: PF20-12-PP-c9 | Preço base: R$ 99,00/metro
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulários das Peças */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Configure suas peças
              </h2>
              <Button
                onClick={adicionarPeca}
                className="bg-accent hover:bg-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Dimensão
              </Button>
            </div>

            {pecas.map((peca, index) => (
              <PecaForm
                key={peca.id}
                peca={peca}
                index={index}
                onUpdate={(pecaAtualizada) => atualizarPeca(index, pecaAtualizada)}
                onRemove={() => removerPeca(index)}
                canRemove={pecas.length > 1}
              />
            ))}
          </div>

          {/* Resumo do Orçamento */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ResumoOrcamento
                pecas={pecas}
                productVariantId={PRODUCT_VARIANT_ID}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
