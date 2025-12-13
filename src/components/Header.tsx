import { useState, FormEvent } from "react";
import { Search, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { CategoryMenu } from "./CategoryMenu";
import { CartDrawer } from "./CartDrawer";
import { INSTITUTIONAL_LINKS } from "@/data/categories";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Bar - Institutional Links */}
      <div className="bg-muted/50 border-b border-border text-xs">
        <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Address */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Rua Antônio Le Voci, 151 - Bairro: Terceira Divisão de Interlagos - São Paulo / SP - CEP: 04809-220</span>
          </div>
          
          {/* Institutional Links */}
          <div className="flex items-center gap-3">
            {INSTITUTIONAL_LINKS.map((link, index) => (
              <span key={link.name} className="flex items-center gap-3">
                {link.external ? (
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
                {index < INSTITUTIONAL_LINKS.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </span>
            ))}
            <span className="text-border">|</span>
            <a 
              href="https://pradoautomacaoindustrial.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-medium hover:bg-accent/90 transition-colors"
            >
              Visite Nosso Site Institucional
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Prado Automação Industrial" 
                className="h-12 object-contain"
              />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 w-full max-w-2xl relative">
              <Input
                type="text"
                placeholder="Busca"
                className="w-full pr-12 h-12 rounded-lg border-border bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-10 w-10 rounded-md text-muted-foreground hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>

            {/* User Actions */}
            <div className="flex items-center gap-6">
              <Link to="/account" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <User className="h-5 w-5" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs text-muted-foreground leading-tight">Olá,</p>
                  <p className="text-sm font-medium">Sua conta</p>
                </div>
              </Link>
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
