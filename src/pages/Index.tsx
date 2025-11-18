import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { storefrontApiRequest } from "@/lib/shopify";

interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
  };
}

const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, { first: 10 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Featured Products Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              Produtos em Destaque
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Navegar</span>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado. Crie produtos na sua loja Shopify.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.node.id}
                  product={{
                    id: product.node.id,
                    name: product.node.title,
                    price: parseFloat(product.node.priceRange.minVariantPrice.amount),
                    image: product.node.images.edges[0]?.node.url || "/placeholder.svg",
                    handle: product.node.handle,
                  }}
                  onClick={() => navigate(`/product/${product.node.handle}`)}
                />
              ))
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-16 bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Perfis Estruturais Personalizados
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Configuração Sob Medida
              </h3>
              <p className="text-sm">
                Configure seus perfis de alumínio com comprimentos personalizados de 1mm a 3000mm. 
                Escolha entre diversos serviços de usinagem sem custo adicional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Qualidade e Precisão
              </h3>
              <p className="text-sm">
                Perfis em alumínio com acabamento em pintura eletrostática preta. 
                Tolerância de corte de até ±3mm conforme norma ABNT NBR 8116.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Prado Automação Industrial. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
