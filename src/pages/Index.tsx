import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";
const GET_ALL_PRODUCTS_QUERY = `
  query getAllProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
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
          metafields(identifiers: [
            {namespace: "custom", key: "codigo"},
            {namespace: "custom", key: "comprimento_min"},
            {namespace: "custom", key: "comprimento_max"},
            {namespace: "custom", key: "peso"},
            {namespace: "custom", key: "tolerancia"}
          ]) {
            key
            value
            namespace
          }
          tags
        }
      }
    }
  }
`;
export default function Index() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(GET_ALL_PRODUCTS_QUERY, {
          first: 50,
          query: null
        });
        const products = data.data.products?.edges || [];
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const featuredProducts = allProducts
    .filter(p => p.node.tags?.includes('featured'))
    .slice(0, 4);
  const bestSellerProducts = allProducts
    .filter(p => p.node.tags?.includes('best-seller'))
    .slice(0, 8);

  // Renderizar produto individual
  const renderProduct = (product: ShopifyProduct) => <div key={product.node.id} onClick={() => navigate(`/product/${product.node.handle}`)} className="cursor-pointer">
      <ProductCard product={{
      id: product.node.id,
      name: product.node.title,
      price: parseFloat(product.node.priceRange.minVariantPrice.amount),
      image: product.node.images.edges[0]?.node.url || "/placeholder.svg",
      handle: product.node.handle
    }} />
    </div>;
  const renderSkeletons = (count: number) => Array.from({
    length: count
  }).map((_, index) => <div key={`skeleton-${index}`} className="space-y-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>);
  return <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0tMiAwdi0yaC0ydjJoMnptLTItMnYtMmgtMnYyaDJ6bTQgMHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Componentes para<br />Máquinas Automáticas
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Soluções completas em movimentação linear, perfis estruturais e componentes de precisão para sua indústria
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/catalog")}
              >
                Ver Catálogo Completo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Fale Conosco
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <TrustBadges />
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3 text-foreground">
                Produtos em Destaque
              </h2>
              <p className="text-muted-foreground text-lg">
                Confira nossa seleção especial de produtos mais procurados
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && featuredProducts.length > 0 && featuredProducts.map(product => renderProduct(product))}
              {!loading && featuredProducts.length === 0 && 
                <div className="col-span-full text-center text-muted-foreground py-8">
                  Nenhum produto em destaque disponível no momento.
                </div>
              }
            </div>
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3 text-foreground">
                Mais Vendidos
              </h2>
              <p className="text-muted-foreground text-lg">
                Produtos com maior procura pelos nossos clientes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {loading && renderSkeletons(8)}
              {!loading && bestSellerProducts.length > 0 && bestSellerProducts.map(product => renderProduct(product))}
              {!loading && bestSellerProducts.length === 0 && 
                <div className="col-span-full text-center text-muted-foreground py-8">
                  Ainda não há produtos mais vendidos disponíveis.
                </div>
              }
            </div>
            {!loading && bestSellerProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/catalog")}
                >
                  Ver Todos os Produtos
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Seção de Contato */}
        <section id="contact" className="py-16 bg-background border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
                    Dúvidas? Entre em contato conosco
                  </h2>
                  <p className="text-center text-muted-foreground mb-8">
                    Nossa equipe está pronta para atender você
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Informações de Contato */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Endereço</h3>
                          <p className="text-muted-foreground text-sm">
                            Rua Antônio Le Voci, 151<br />
                            Terceira Divisão de Interlagos<br />
                            São Paulo - SP, 04809-220
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
                          <a href="mailto:vendas@pradoindustrial.com.br" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                            vendas@pradoindustrial.com.br
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Mapa */}
                    <div className="rounded-lg overflow-hidden border border-border h-64">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.5934886!2d-46.6987!3d-23.6826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce4f8b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sRua%20Ant%C3%B4nio%20Le%20Voci%2C%20151%20-%20Cidade%20Dutra%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004809-220!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}