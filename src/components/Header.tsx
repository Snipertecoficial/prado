import { Search, User, Phone, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CategoryMenu } from "./CategoryMenu";
import { CartDrawer } from "./CartDrawer";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
        <div className="container mx-auto px-4 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 font-semibold">
              <Phone className="h-4 w-4" />
              <span>(11) 5666-6461</span>
              <span className="hidden sm:block">|</span>
              <span className="font-normal">(11) 94242-8989</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-primary-foreground/80">
              <Clock3 className="h-4 w-4" />
              <span>Atendimento de seg a sex: 08h às 18h</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-primary-foreground/80">
            <span>São Paulo - SP (capital)</span>
            <span className="hidden sm:inline">|</span>
            <span>Grande São Paulo</span>
            <span className="hidden sm:inline">|</span>
            <span>Demais Estados</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                <div>
                  <p className="text-[28px] leading-none font-bold text-primary">PRADO</p>
                  <span className="block text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    Automação Industrial
                  </span>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 w-full relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos e categorias"
                  className="w-full pr-12 h-12 rounded-lg border-border/80"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-10 w-10 rounded-md text-primary"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">Precisa de ajuda?</p>
                  <p className="text-sm font-semibold text-primary">(11) 5666-6461</p>
                  <p className="text-xs text-muted-foreground">São Paulo - SP (capital)</p>
                </div>
                <div className="hidden sm:block h-12 w-px bg-border" aria-hidden />
                <Link to="/account" className="flex items-center gap-2 text-foreground">
                  <User className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground leading-tight">Olá,</p>
                    <Button variant="link" className="p-0 h-auto text-foreground text-sm">
                      Sua conta
                    </Button>
                  </div>
                </Link>
                <CartDrawer />
              </div>
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
