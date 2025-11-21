import { Search, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CategoryMenu } from "./CategoryMenu";
import { CartDrawer } from "./CartDrawer";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                Rua Antônio Le Voci, 151 - Bairro: Terceira Divisão de Interlagos - São Paulo / SP - CEP: 04809-220
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/mapa" className="text-muted-foreground hover:text-foreground transition-colors">
                Mapa do site
              </a>
              <Button variant="default" className="bg-accent hover:bg-accent/90">
                ⭐ Visite Nosso Site Institucional
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary">
                PRADO
                <span className="block text-sm font-normal text-muted-foreground">
                  AUTOMAÇÃO INDUSTRIAL
                </span>
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
              <Input
                type="text"
                placeholder="Busca"
                className="w-full pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <Link to="/account" className="text-right">
                <p className="text-sm text-muted-foreground">Olá,</p>
                <Button variant="link" className="p-0 h-auto text-foreground">
                  Sua conta
                </Button>
              </Link>
              <User className="h-6 w-6 text-muted-foreground" />
              
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <CategoryMenu />
      </header>
    </>
  );
};

export default Header;
export { Header };
