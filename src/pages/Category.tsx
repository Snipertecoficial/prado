import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/data/categories";

const GET_PRODUCTS_BY_TAG_QUERY = `
  query getProductsByTag($query: String!, $first: Int!) {
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
        }
      }
    }
  }
`;

export default function Category() {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find(c => c.slug === categorySlug);
  const subcategory = category?.subcategories.find(s => s.slug === subcategorySlug);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Buscar produtos com tag da subcategoria
        const searchQuery = subcategorySlug 
          ? `tag:${subcategorySlug}`
          : `tag:${categorySlug}`;

        const data = await storefrontApiRequest(GET_PRODUCTS_BY_TAG_QUERY, {
          query: searchQuery,
          first: 50
        });

        setProducts(data.data.products.edges);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, subcategorySlug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          {" / "}
          <Link to={`/categoria/${categorySlug}`} className="hover:text-primary">
            {category?.name}
          </Link>
          {subcategory && (
            <>
              {" / "}
              <span className="text-foreground">{subcategory.name}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {subcategory?.name || category?.name}
          </h1>
          {category?.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    handle: product.node.handle
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">
              Voltar para Home
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
