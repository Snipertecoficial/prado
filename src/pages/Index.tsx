import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
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
          tags
        }
      }
    }
  }
`;

// Format price in Brazilian Real
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export default function Index() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [bestSellerIndex, setBestSellerIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(GET_ALL_PRODUCTS_QUERY, {
          first: 50,
          query: null
        });
        const products = data?.data?.products?.edges || [];
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by tags
  const featuredProducts = allProducts.filter(p => p.node.tags?.includes('featured'));
  const bestSellerProducts = allProducts.filter(p => p.node.tags?.includes('best-seller'));
  
  // Products to display (4 at a time)
  const visibleFeatured = featuredProducts.slice(featuredIndex, featuredIndex + 4);
  const visibleBestSellers = bestSellerProducts.slice(bestSellerIndex, bestSellerIndex + 4);

  // Navigation handlers
  const nextFeatured = () => {
    if (featuredIndex + 4 < featuredProducts.length) {
      setFeaturedIndex(featuredIndex + 4);
    }
  };
  const prevFeatured = () => {
    if (featuredIndex > 0) {
      setFeaturedIndex(featuredIndex - 4);
    }
  };
  const nextBestSeller = () => {
    if (bestSellerIndex + 4 < bestSellerProducts.length) {
      setBestSellerIndex(bestSellerIndex + 4);
    }
  };
  const prevBestSeller = () => {
    if (bestSellerIndex > 0) {
      setBestSellerIndex(bestSellerIndex - 4);
    }
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: ShopifyProduct }) => {
    const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
    const installmentPrice = price / 2;
    const imageUrl = product.node.images.edges[0]?.node.url || "/placeholder.svg";

    return (
      <Card 
        className="group cursor-pointer border border-border hover:shadow-lg transition-all duration-300 bg-card"
        onClick={() => navigate(`/product/${product.node.handle}`)}
      >
        <CardContent className="p-4">
          {/* Product Image */}
          <div className="aspect-square mb-4 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={imageUrl}
              alt={product.node.title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Product Title */}
          <h3 className="text-sm font-medium text-foreground uppercase text-center mb-3 line-clamp-2 min-h-[40px]">
            {product.node.title}
          </h3>
          
          {/* Price */}
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {formatPrice(price)}
            </p>
            {price > 20 && (
              <p className="text-sm text-muted-foreground mt-1">
                2x de {formatPrice(installmentPrice)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Section Header Component
  const SectionHeader = ({ 
    title, 
    onPrev, 
    onNext, 
    canPrev, 
    canNext 
  }: { 
    title: string; 
    onPrev: () => void; 
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
  }) => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          {title}
        </h2>
        <div className="h-1 w-20 bg-accent mt-2 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={!canPrev}
          className="h-9 w-9 border-border"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground px-2">Navegar</span>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canNext}
          className="h-9 w-9 border-border"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Skeleton loader
  const renderSkeletons = (count: number) => 
    Array.from({ length: count }).map((_, index) => (
      <Card key={`skeleton-${index}`} className="border border-border">
        <CardContent className="p-4">
          <Skeleton className="aspect-square mb-4 rounded-lg" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-3" />
          <Skeleton className="h-8 w-24 mx-auto" />
        </CardContent>
      </Card>
    ));

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1">
        {/* Produtos em Destaque */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Produtos em Destaque"
              onPrev={prevFeatured}
              onNext={nextFeatured}
              canPrev={featuredIndex > 0}
              canNext={featuredIndex + 4 < featuredProducts.length}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && visibleFeatured.length > 0 && 
                visibleFeatured.map(product => (
                  <ProductCard key={product.node.id} product={product} />
                ))
              }
              {!loading && featuredProducts.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  Nenhum produto em destaque disponível no momento.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Mais Vendidos"
              onPrev={prevBestSeller}
              onNext={nextBestSeller}
              canPrev={bestSellerIndex > 0}
              canNext={bestSellerIndex + 4 < bestSellerProducts.length}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && visibleBestSellers.length > 0 && 
                visibleBestSellers.map(product => (
                  <ProductCard key={product.node.id} product={product} />
                ))
              }
              {!loading && bestSellerProducts.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  Ainda não há produtos mais vendidos disponíveis.
                </div>
              )}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                onClick={() => navigate("/catalog")}
              >
                Ver Todos os Produtos
              </Button>
            </div>
          </div>
        </section>

        {/* Seção de Contato */}
        <section id="contact" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-border">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-2 text-primary">
                    Dúvidas? Entre em contato conosco
                  </h2>
                  <p className="text-center text-muted-foreground mb-8">
                    Nossa equipe está pronta para atender você
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1 text-foreground">Endereço</h3>
                          <p className="text-muted-foreground text-sm">
                            Rua Antônio Le Voci, 151<br />
                            Terceira Divisão de Interlagos<br />
                            São Paulo - SP, 04809-220
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1 text-foreground">Telefones</h3>
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
                        <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1 text-foreground">Email</h3>
                          <a href="mailto:vendas@pradoindustrial.com.br" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                            vendas@pradoindustrial.com.br
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Map */}
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
    </div>
  );
}
