import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";

const FALLBACK_PRODUCTS: ShopifyProduct[] = [
  {
    node: {
      id: "fallback-1",
      title: "Pillow Aberto para Eixo Suportado - Diâmetro 25mm - SBR/SL",
      description: "Pillow aberto para guia linear SBR/SL",
      handle: "pillow-aberto-25mm",
      priceRange: {
        minVariantPrice: { amount: "129.59", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Pillow+Aberto+25mm",
              altText: "Pillow Aberto 25mm",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-2",
      title: "Rolamento LM20UU",
      description: "Rolamento linear LM20UU",
      handle: "rolamento-lm20uu",
      priceRange: {
        minVariantPrice: { amount: "72.99", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Rolamento+LM20UU",
              altText: "Rolamento LM20UU",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-3",
      title: "Fuso de Esfera Laminado 12mm Passo 04",
      description: "Fuso de esfera laminado",
      handle: "fuso-esfera-12mm",
      priceRange: {
        minVariantPrice: { amount: "124.83", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Fuso+de+Esferas",
              altText: "Fuso de Esferas",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-4",
      title: "Perfil Estrutural 20×40 T-Slot Canal 6mm",
      description: "Perfil estrutural em alumínio",
      handle: "perfil-estrutural-20x40",
      priceRange: {
        minVariantPrice: { amount: "44.99", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Perfil+Estrutural+20x40",
              altText: "Perfil Estrutural 20x40",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-5",
      title: "GLP - Guia Linear de 15mm",
      description: "Guia linear 15mm",
      handle: "guia-linear-15mm",
      priceRange: {
        minVariantPrice: { amount: "179.9", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Guia+Linear+15mm",
              altText: "Guia Linear 15mm",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-6",
      title: "Perfil Estrutural 20×40 T-Slot Canal 6mm | Medalhão",
      description: "Perfil estrutural medalhão",
      handle: "perfil-estrutural-medalhao",
      priceRange: {
        minVariantPrice: { amount: "98.9", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Perfil+Medalhao",
              altText: "Perfil estrutural medalhão",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-7",
      title: "GLP - Guia Linear de 20mm",
      description: "Guia linear 20mm",
      handle: "guia-linear-20mm",
      priceRange: {
        minVariantPrice: { amount: "165.9", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Guia+Linear+20mm",
              altText: "Guia linear 20mm",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
  {
    node: {
      id: "fallback-8",
      title: "GLP - Guia Linear de 30mm",
      description: "Guia linear 30mm",
      handle: "guia-linear-30mm",
      priceRange: {
        minVariantPrice: { amount: "189.9", currencyCode: "BRL" },
      },
      images: {
        edges: [
          {
            node: {
              url: "https://dummyimage.com/600x600/f1f4fb/0f2a5c&text=Guia+Linear+30mm",
              altText: "Guia linear 30mm",
            },
          },
        ],
      },
      variants: { edges: [] },
    },
  },
];
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

export default function Index() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(GET_ALL_PRODUCTS_QUERY, {
          first: 12,
        });

        const products = data.data.products?.edges || [];
        if (products.length === 0) {
          setAllProducts(FALLBACK_PRODUCTS);
        } else {
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = allProducts.slice(0, 4);
  const bestSellerProducts = allProducts.slice(0, 8);

  // Renderizar produto individual
  const renderProduct = (product: ShopifyProduct) => (
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
  );

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-${index}`} className="space-y-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ));

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fd]">
      <Header />

      <main className="flex-1">
        {/* Produtos em Destaque */}
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-primary">Produtos em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderSkeletons(4)}
              {!loading && featuredProducts.length > 0 &&
                featuredProducts.map((product) => renderProduct(product))}
              {!loading && featuredProducts.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                  Nenhum produto em destaque disponível no momento.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mais Vendidos */}
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-3xl font-bold text-primary">Mais Vendidos</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
                      Produtos
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full border-border text-muted-foreground hover:bg-muted">
                      Aplicações
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full border-border text-muted-foreground hover:bg-muted">
                      Serviços
                    </Button>
                  </div>
                </div>

                <Card className="bg-[#f5f7fb] border-border/70">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {["Eixo", "Guia Linear", "Fuso de Esferas", "Perfil Estrutural", "Rolamento Linear", "Rolamento Radial", "Mancal"].map((tag) => (
                        <Button
                          key={tag}
                          size="sm"
                          variant="secondary"
                          className="rounded-full bg-white text-primary border-border hover:bg-primary hover:text-primary-foreground"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loading && renderSkeletons(8)}
                  {!loading && bestSellerProducts.length > 0 &&
                    bestSellerProducts.map((product) => renderProduct(product))}
                  {!loading && bestSellerProducts.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                      Ainda não há produtos mais vendidos disponíveis.
                    </div>
                  )}
                </div>
              </div>

              <aside className="w-full lg:max-w-sm">
                <Card className="h-full border-primary/20 shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">Precisa de ajuda?</p>
                      <h3 className="text-2xl font-bold text-primary">Fale diretamente com um especialista</h3>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>📍 Av. Imirim, 2850 - Imirim - São Paulo - SP, 02465-600</p>
                      <p>📞 (11) 5666-6461 | (11) 94242-8989</p>
                      <p>✉️ vendas@pradoindustrial.com.br</p>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-border">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.3828775628044!2d-46.63841492369895!3d-23.493088778822547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef6a3e3b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sAv.%20Imirim%2C%202850%20-%20Imirim%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002465-600!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa Prado"
                      ></iframe>
                    </div>

                    <Button className="w-full" variant="default">
                      Como Chegar
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
