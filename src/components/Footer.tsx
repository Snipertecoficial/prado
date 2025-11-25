import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground mt-16 relative overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0tMiAwdi0yaC0ydjJoMnptLTItMnYtMmgtMnYyaDJ6bTQgMHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-100"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo e Sobre */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4 group">
              <div className="flex items-center gap-3">
                
                <div>
                  <p className="text-2xl leading-none font-bold text-primary-foreground">PRADO</p>
                  <span className="block text-[10px] font-semibold tracking-[0.12em] text-primary-foreground/80 uppercase">
                    Automação Industrial
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              Componentes para máquinas automáticas e estruturas modulares de alta qualidade.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-foreground/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-foreground">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/empresa" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-foreground">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Perfis de Alumínio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Motores e Drivers
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Componentes CNC
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary-foreground">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <MapPin className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <div>
                  <p className="text-primary-foreground/90 text-sm leading-relaxed">
                    Rua Antônio Le Voci, 151<br />
                    Terceira Divisão de Interlagos<br />
                    São Paulo - SP, 04809-220
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Phone className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <div className="text-primary-foreground/90 text-sm">
                  <a href="tel:+551156666461" className="hover:text-accent transition-colors block">
                    (11) 5666-6461
                  </a>
                  <a href="tel:+5511942428989" className="hover:text-accent transition-colors block">
                    (11) 94242-8989
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                  <Mail className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <a href="mailto:vendas@pradoindustrial.com.br" className="text-primary-foreground/90 hover:text-accent text-sm transition-colors">
                  vendas@pradoindustrial.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © {new Date().getFullYear()} Prado Automação Industrial. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs text-primary-foreground/70">
              <Link to="/politica-privacidade" className="hover:text-accent transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-uso" className="hover:text-accent transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};