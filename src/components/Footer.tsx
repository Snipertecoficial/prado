import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpg";

export const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5511942428989", "_blank");
  };

  return (
    <>
      {/* Main Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left side - Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <a 
                  href="tel:+551156666461" 
                  className="flex items-center gap-2 text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary-foreground" />
                  <span>11 5666-6461</span>
                </a>
                <a 
                  href="https://wa.me/5511942428989" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                  <span>11 94242-8989</span>
                </a>
              </div>
              <a 
                href="mailto:vendas@pradoindustrial.com.br" 
                className="flex items-center gap-2 text-primary-foreground/90 hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5 text-primary-foreground" />
                <span>vendas@pradoindustrial.com.br</span>
              </a>
            </div>

            {/* Right side - Address and Directions */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:justify-end">
              <div className="flex items-start gap-2 text-primary-foreground/90">
                <MapPin className="h-5 w-5 text-primary-foreground flex-shrink-0 mt-1" />
                <span className="text-sm">
                  Rua Antônio Le Voci, 151 - Bairro: Terceira Divisão de Interlagos - São Paulo / SP - CEP: 04809-220
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Input 
                  type="text" 
                  placeholder="Digite o seu endereço"
                  className="bg-primary-foreground text-foreground border-0 placeholder:text-muted-foreground w-48"
                />
                <Button variant="secondary" className="bg-[#1a2d4a] hover:bg-[#243a5c] text-primary-foreground border-0">
                  Como Chegar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-muted py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © 2021 - PRADO AUTOMACAO E COMPONENTES INDUSTRIAIS EIRELI - CNPJ 30.008.375/0001-69 - Todos os direitos reservados.
              </p>
              {/* Logo in footer */}
              <Link to="/" className="flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Prado Automação Industrial" 
                  className="h-10 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5C] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Contato via WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>
    </>
  );
};
