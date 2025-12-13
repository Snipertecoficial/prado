import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Use all products for both sections if no tags exist, otherwise filter by tags
  const featuredProducts = allProducts.filter(p => p.node.tags?.includes('featured'));
  const bestSellerProducts = allProducts.filter(p => p.node.tags?.includes('best-seller'));
  
  // If no tagged products, show all products in both sections
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : allProducts;
  const displayBestSellers = bestSellerProducts.length > 0 ? bestSellerProducts : allProducts;
  
  // Products to display (4 at a time)
  const visibleFeatured = displayFeatured.slice(featuredIndex, featuredIndex + 4);
  const visibleBestSellers = displayBestSellers.slice(bestSellerIndex, bestSellerIndex + 4);

  // Navigation handlers
  const nextFeatured = () => {
    if (featuredIndex + 4 < displayFeatured.length) {
      setFeaturedIndex(featuredIndex + 4);
    }
  };
  const prevFeatured = () => {
    if (featuredIndex > 0) {
      setFeaturedIndex(featuredIndex - 4);
    }
  };
  const nextBestSeller = () => {
    if (bestSellerIndex + 4 < displayBestSellers.length) {
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
              canNext={featuredIndex + 4 < displayFeatured.length}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && visibleFeatured.length > 0 && 
                visibleFeatured.map(product => (
                  <ProductCard key={product.node.id} product={product} />
                ))
              }
              {!loading && displayFeatured.length === 0 && (
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
              canNext={bestSellerIndex + 4 < displayBestSellers.length}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && visibleBestSellers.length > 0 && 
                visibleBestSellers.map(product => (
                  <ProductCard key={product.node.id} product={product} />
                ))
              }
              {!loading && displayBestSellers.length === 0 && (
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
      </main>

      <Footer />
    </div>
  );
}
