import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail } from "lucide-react";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
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

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<ShopifyProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, { first: 20 });
        const edges: ShopifyProduct[] = data.data.products.edges || [];
        const uniqueByHandle = Array.from(
          new Map(edges.map(edge => [edge.node.handle, edge])).values(),
        );

        setFeaturedProducts(uniqueByHandle.slice(0, 3));
        setBestSellers(uniqueByHandle.slice(3, 7).length ? uniqueByHandle.slice(3, 7) : uniqueByHandle.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError("Não foi possível carregar os produtos no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função auxiliar para encontrar produto por handle
  // Renderizar produto individual
  const renderProduct = (product: ShopifyProduct, index: number) => (
    <div
      key={product.node.handle}
      onClick={() => navigate(`/product/${product.node.handle}`)}
      className="cursor-pointer"
    >
      <ProductCard
        product={{
          id: product.node.id,
          name: product.node.title,
          price: parseFloat(product.node.priceRange.minVariantPrice.amount),
          image: product.node.images.edges[0]?.node.url || "/placeholder.svg",
          handle: product.node.handle,
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Componentes para Máquinas Automáticas
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Soluções completas em movimentação linear, perfis estruturais e componentes de precisão
            </p>
            <Button
              type="button"
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/categoria/perfil-estrutural")}
            >
              Ver Catálogo Completo
            </Button>
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Produtos em Destaque
            </h2>
            {error && (
              <div className="text-center text-destructive mb-6">{error}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : featuredProducts.map(renderProduct)}
            </div>
            {!loading && !featuredProducts.length && !error && (
              <p className="text-center text-muted-foreground mt-4">Nenhum produto disponível.</p>
            )}
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Mais Vendidos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                : bestSellers.map(renderProduct)}
            </div>
            {!loading && !bestSellers.length && !error && (
              <p className="text-center text-muted-foreground mt-4">Nenhum produto encontrado.</p>
            )}
          </div>
        </section>

        {/* Seção de Contato */}
        <section className="py-16 bg-background border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
                    Dúvidas? Entre em contato conosco
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Informações de Contato */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Endereço</h3>
                          <p className="text-muted-foreground text-sm">
                            Av. Imirim, 2850 - Imirim<br />
                            São Paulo - SP, 02465-600
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Telefones</h3>
                          <p className="text-muted-foreground text-sm">
                            <a href="tel:+551156666461" className="hover:text-primary transition-colors">
                              (11) 5666-6461
                            </a>
                            <br />
                            <a href="tel:+5511942428989" className="hover:text-primary transition-colors">
                              (11) 94242-8989
                            </a>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Email</h3>
                          <a
                            href="mailto:vendas@pradoindustrial.com.br"
                            className="text-muted-foreground hover:text-primary text-sm transition-colors"
                          >
                            vendas@pradoindustrial.com.br
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Mapa */}
                    <div className="rounded-lg overflow-hidden border border-border h-64">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.3828775628044!2d-46.63841492369895!3d-23.493088778822547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef6a3e3b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sAv.%20Imirim%2C%202850%20-%20Imirim%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002465-600!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
