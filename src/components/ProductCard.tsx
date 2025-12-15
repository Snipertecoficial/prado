import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatarPreco } from "@/lib/calculations";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id?: string;
    name: string;
    price: number;
    image: string;
    installments?: number;
    installmentPrice?: number;
    handle?: string;
  };
  onClick?: () => void;
  featured?: boolean;
}

const ProductCard = ({ product, onClick, featured = false }: ProductCardProps) => {
  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/80 h-full hover:-translate-y-1 relative overflow-hidden"
      onClick={onClick}
    >
      {featured && (
        <Badge className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Destaque
        </Badge>
      )}
      <CardContent className="p-4 space-y-3 h-full flex flex-col">
        <div className="aspect-square relative bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center group-hover:bg-muted/70 transition-colors">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-semibold text-sm text-center text-foreground leading-snug min-h-[44px] group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="text-center mt-auto">
          <p className="text-xl font-bold text-primary mb-1">
            {formatarPreco(product.price)}
          </p>
          {product.installmentPrice && product.installments && (
            <p className="text-xs text-muted-foreground font-medium">
              {product.installments}x de {formatarPreco(product.installmentPrice)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
export { ProductCard };
