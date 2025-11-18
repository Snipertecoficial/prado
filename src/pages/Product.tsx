import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { PecaPerfil2040, PRECO_POR_METRO_DEFAULT } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PecaForm from "@/components/configurator/PecaForm";
import ResumoOrcamento from "@/components/configurator/ResumoOrcamento";
import { storefrontApiRequest } from "@/lib/shopify";

interface ShopifyProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
}

const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      variants(first: 1) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pecas, setPecas] = useState<PecaPerfil2040[]>([
    {
      id: crypto.randomUUID(),
      comprimentoMm: 40,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: PRECO_POR_METRO_DEFAULT,
      precoTotalPeca: 3.96,
    },
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await storefrontApiRequest(GET_PRODUCT_BY_HANDLE, { handle });
        
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        } else {
          toast({
            variant: "destructive",
            title: "Produto não encontrado",
            description: "O produto solicitado não foi encontrado.",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produto",
          description: "Não foi possível carregar as informações do produto.",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchProduct();
    }
  }, [handle, navigate, toast]);

  const adicionarPeca = () => {
    const novaPeca: PecaPerfil2040 = {
      id: crypto.randomUUID(),
      comprimentoMm: 40,
      quantidade: 1,
      servico: "sem_servico",
      precoPorMetro: PRECO_POR_METRO_DEFAULT,
      precoTotalPeca: 3.96,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productVariantId = product.variants.edges[0]?.node.id;
  const mainImage = product.images.edges[0]?.node.url;

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

        {/* Product Header with Image */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                className="max-h-96 w-auto object-contain"
              />
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Sem imagem disponível
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            {product.description && (
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              Código: {product.handle.toUpperCase()} | Preço base: R$ 99,00/metro
            </p>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Envio rápido</h3>
              <p className="text-sm text-muted-foreground">
                Envio em até 2 dias úteis
              </p>
            </div>
          </div>
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
                productVariantId={productVariantId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
