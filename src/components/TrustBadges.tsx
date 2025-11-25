import { Shield, Truck, CreditCard, Headphones } from "lucide-react";

export const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Ambiente 100% protegido",
    },
    {
      icon: Truck,
      title: "Entrega Garantida",
      description: "Enviamos para todo Brasil",
    },
    {
      icon: CreditCard,
      title: "Pagamento Flexível",
      description: "Parcele suas compras",
    },
    {
      icon: Headphones,
      title: "Suporte Técnico",
      description: "Atendimento especializado",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <Icon className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
};
