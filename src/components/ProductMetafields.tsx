import { Badge } from "@/components/ui/badge";
import { Ruler, Weight, Package } from "lucide-react";

interface Metafield {
  key: string;
  value: string;
  namespace: string;
}

interface ProductMetafieldsProps {
  metafields?: Metafield[];
  variant?: "compact" | "detailed";
}

export const ProductMetafields = ({ metafields, variant = "compact" }: ProductMetafieldsProps) => {
  if (!metafields || metafields.length === 0) return null;

  const getMetafieldValue = (key: string) => {
    return metafields.find(m => m.key === key)?.value;
  };

  const codigo = getMetafieldValue("codigo");
  const comprimentoMin = getMetafieldValue("comprimento_min");
  const comprimentoMax = getMetafieldValue("comprimento_max");
  const peso = getMetafieldValue("peso");
  const tolerancia = getMetafieldValue("tolerancia");

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        {codigo && (
          <Badge variant="outline" className="gap-1">
            <Package className="h-3 w-3" />
            {codigo}
          </Badge>
        )}
        {peso && (
          <Badge variant="outline" className="gap-1">
            <Weight className="h-3 w-3" />
            {peso} kg/m
          </Badge>
        )}
        {comprimentoMin && comprimentoMax && (
          <Badge variant="outline" className="gap-1">
            <Ruler className="h-3 w-3" />
            {comprimentoMin}-{comprimentoMax}mm
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      {codigo && (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Código:</span>
          <span className="font-medium">{codigo}</span>
        </div>
      )}
      {peso && (
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Peso:</span>
          <span className="font-medium">{peso} kg/metro</span>
        </div>
      )}
      {comprimentoMin && comprimentoMax && (
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Comprimento:</span>
          <span className="font-medium">{comprimentoMin}mm - {comprimentoMax}mm</span>
        </div>
      )}
      {tolerancia && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Tolerância:</span>
          <span className="font-medium">{tolerancia}</span>
        </div>
      )}
    </div>
  );
};
