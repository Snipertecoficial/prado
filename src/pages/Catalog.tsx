import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";
import { ArrowLeft } from "lucide-react";

const GET_ALL_PRODUCTS_QUERY = `
  query getAllProducts($first: Int!) {
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

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(GET_ALL_PRODUCTS_QUERY, {
          first: 100
        });
        setProducts(data?.data?.products?.edges || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 20, products.length));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Catálogo Completo</h1>
            <p className="text-muted-foreground">
              {loading ? "Carregando produtos..." : `${products.length} produtos disponíveis`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading && (
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="space-y-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </>
            )}

            {!loading && visibleProducts.length > 0 && (
              <>
                {visibleProducts.map((product) => (
                  <div
                    key={product.node.id}
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
                ))}
              </>
            )}

            {!loading && products.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado no catálogo.
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} size="lg">
                Carregar Mais Produtos
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
