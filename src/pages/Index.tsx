import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

const Index = () => {
  const navigate = useNavigate();

  const featuredProducts: Product[] = [
    {
      id: "1",
      name: "PPW - PATINS COM ABA DE 25MM",
      price: 128.0,
      installmentPrice: 64.0,
      installments: 2,
      image: "/placeholder.svg",
    },
    {
      id: "2",
      name: "ROLAMENTO RÍGIDO DE ESFERAS 6900ZZ RADIAL",
      price: 2.31,
      image: "/placeholder.svg",
    },
    {
      id: "3",
      name: "FUSO DE ESFERA LAMINADO 25MM PASSO 10",
      price: 2.21,
      image: "/placeholder.svg",
    },
    {
      id: "4",
      name: "EIXO RETIFICADO E CROMADO 30MM",
      price: 1.80,
      image: "/placeholder.svg",
    },
  ];

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
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onConfigure={() => navigate("/configurator")}
              />
            ))}
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
                Configure seus perfis de alumínio com comprimentos personalizados de 40mm a 3000mm. 
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
