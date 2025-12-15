import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { formatarPreco } from "@/lib/calculations";

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
      images(first: 20) {
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

  const galleryImages = useMemo(
    () => product?.images?.edges?.map(edge => edge.node) ?? [],
    [product?.images?.edges],
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Product fetching will be implemented when new Shopify connection is made
        setProduct(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Produtos
          </Button>
          <div className="text-center py-16">
            <p className="text-muted-foreground">Conecte sua loja Shopify para ver os produtos.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const price = parseFloat(product.variants.edges[0]?.node.price.amount || "0");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductGallery images={galleryImages} />

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            {product.description && (
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
            )}
            <p className="text-3xl font-bold text-primary mb-6">
              {formatarPreco(price)}
            </p>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Envio rápido</h3>
              <p className="text-sm text-muted-foreground">
                Envio em até 2 dias úteis
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
