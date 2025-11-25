import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">PRADO AUTOMAÇÃO INDUSTRIAL</h3>
            <p className="text-muted-foreground text-sm">
              Componentes para máquinas automáticas e estruturas modulares de alta qualidade.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/empresa" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/mapa-do-site" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  Mapa do Site
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Rua Antônio Le Voci, 151<br />
                  Terceira Divisão de Interlagos<br />
                  São Paulo - SP, 04809-220
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-muted-foreground text-sm">
                  <a href="tel:+551156666461" className="hover:text-primary transition-colors">
                    (11) 5666-6461
                  </a>
                  {" / "}
                  <a href="tel:+5511942428989" className="hover:text-primary transition-colors">
                    (11) 94242-8989
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:vendas@pradoindustrial.com.br"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  vendas@pradoindustrial.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Prado Automação Industrial. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
