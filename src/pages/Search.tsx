import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";

const SEARCH_PRODUCTS_QUERY = `
  query searchProducts($query: String!, $first: Int!) {
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
        }
      }
    }
  }
`;

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await storefrontApiRequest(SEARCH_PRODUCTS_QUERY, {
          query: query,
          first: 50,
        });

        const results = data.data.products?.edges || [];
        setProducts(results);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

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
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <SearchIcon className="h-8 w-8" />
              Resultados da Busca
            </h1>
            {query && (
              <p className="text-muted-foreground">
                {loading
                  ? `Buscando por "${query}"...`
                  : `${products.length} resultado${products.length !== 1 ? "s" : ""} para "${query}"`}
              </p>
            )}
          </div>

          {/* Results Grid */}
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

            {!loading && products.length > 0 && (
              <>
                {products.map((product) => (
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

            {!loading && products.length === 0 && query && (
              <div className="col-span-full text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  Nenhum produto encontrado para "{query}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Tente usar outros termos de busca
                </p>
              </div>
            )}

            {!loading && !query && (
              <div className="col-span-full text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Digite algo no campo de busca para encontrar produtos
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
