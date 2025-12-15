import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Bem-vindo à Nossa Loja
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Conecte sua loja Shopify para exibir seus produtos aqui.
            </p>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              onClick={() => navigate("/catalog")}
            >
              Ver Catálogo
            </Button>
          </div>
        </section>

        {/* Placeholder for Products */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Produtos em Destaque
            </h2>
            <div className="text-center py-12 text-muted-foreground">
              Os produtos aparecerão aqui após conectar a loja Shopify.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
