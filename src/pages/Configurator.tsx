import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Settings } from "lucide-react";
import { PecaPerfil2040, ProdutoConfig, PRODUTO_DEFAULT_CONFIG } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PecaForm from "@/components/configurator/PecaForm";
import ResumoOrcamento from "@/components/configurator/ResumoOrcamento";

const Configurator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estado para configuração do produto (admin)
  const [produtoConfig, setProdutoConfig] = useState<ProdutoConfig>(PRODUTO_DEFAULT_CONFIG);
  
  // Estado para as peças configuradas pelo cliente
  const [pecas, setPecas] = useState<PecaPerfil2040[]>([
    {
      id: crypto.randomUUID(),
      comprimentoMm: produtoConfig.minComprimentoMm,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: produtoConfig.precoPorMetro,
      precoTotalPeca: (produtoConfig.minComprimentoMm / 1000) * produtoConfig.precoPorMetro,
    },
  ]);

  const adicionarPeca = () => {
    const novaPeca: PecaPerfil2040 = {
      id: crypto.randomUUID(),
      comprimentoMm: produtoConfig.minComprimentoMm,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: produtoConfig.precoPorMetro,
      precoTotalPeca: (produtoConfig.minComprimentoMm / 1000) * produtoConfig.precoPorMetro,
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

  const handleProdutoConfigChange = (campo: keyof ProdutoConfig, valor: any) => {
    setProdutoConfig(prev => ({
      ...prev,
      [campo]: valor
    }));
    toast({
      title: "Configuração atualizada",
      description: `${campo} alterado com sucesso`,
    });
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

        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Painel Administrativo - Configurador</h1>
        </div>

        <Tabs defaultValue="configuracao" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="configuracao">Configuração do Produto</TabsTrigger>
            <TabsTrigger value="cliente">Visão do Cliente</TabsTrigger>
          </TabsList>

          <TabsContent value="configuracao" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Configurações do Produto</h2>
              
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input
                    id="nome"
                    value={produtoConfig.nome}
                    onChange={(e) => handleProdutoConfigChange("nome", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="precoPorMetro">Preço por Metro (R$)</Label>
                    <Input
                      id="precoPorMetro"
                      type="number"
                      step="0.01"
                      value={produtoConfig.precoPorMetro}
                      onChange={(e) => handleProdutoConfigChange("precoPorMetro", parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pesoPorMetroKg">Peso por Metro (kg)</Label>
                    <Input
                      id="pesoPorMetroKg"
                      type="number"
                      step="0.001"
                      value={produtoConfig.pesoPorMetroKg || 0}
                      onChange={(e) => handleProdutoConfigChange("pesoPorMetroKg", parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minComprimento">Comprimento Mínimo (mm)</Label>
                    <Input
                      id="minComprimento"
                      type="number"
                      value={produtoConfig.minComprimentoMm}
                      onChange={(e) => handleProdutoConfigChange("minComprimentoMm", parseInt(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maxComprimento">Comprimento Máximo (mm)</Label>
                    <Input
                      id="maxComprimento"
                      type="number"
                      value={produtoConfig.maxComprimentoMm}
                      onChange={(e) => handleProdutoConfigChange("maxComprimentoMm", parseInt(e.target.value))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comprimentoBarra">Comprimento Barra (mm)</Label>
                    <Input
                      id="comprimentoBarra"
                      type="number"
                      value={produtoConfig.comprimentoBarraMm}
                      onChange={(e) => handleProdutoConfigChange("comprimentoBarraMm", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="toleranciaCorte">Tolerância de Corte</Label>
                  <Input
                    id="toleranciaCorte"
                    value={produtoConfig.toleranciaCorte}
                    onChange={(e) => handleProdutoConfigChange("toleranciaCorte", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricaoTecnica">Descrição Técnica</Label>
                  <Textarea
                    id="descricaoTecnica"
                    value={produtoConfig.descricaoTecnica || ""}
                    onChange={(e) => handleProdutoConfigChange("descricaoTecnica", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Resumo da Configuração</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Preço base: R$ {produtoConfig.precoPorMetro.toFixed(2)}/m</li>
                    <li>• Comprimento: {produtoConfig.minComprimentoMm}mm - {produtoConfig.maxComprimentoMm}mm</li>
                    <li>• Tolerância: {produtoConfig.toleranciaCorte}</li>
                    <li>• Serviços disponíveis: {produtoConfig.servicosPermitidos.length}</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cliente" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{produtoConfig.nome}</h2>
                <p className="text-muted-foreground">Preço: R$ {produtoConfig.precoPorMetro.toFixed(2)}/m</p>
                <p className="text-sm text-muted-foreground">{produtoConfig.toleranciaCorte}</p>
              </div>

              {/* Formulários das Peças */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Configure suas peças
                  </h3>
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
                    produtoConfig={produtoConfig}
                  />
                ))}
              </div>

              <ResumoOrcamento
                pecas={pecas}
                productVariantId={PRODUCT_VARIANT_ID}
                produtoConfig={produtoConfig}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configurator;
