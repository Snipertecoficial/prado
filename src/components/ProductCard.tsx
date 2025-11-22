import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { formatarPreco } from "@/lib/calculations";

interface ProductCardProps {
  product: Product & { handle?: string };
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-border/80 h-full"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3 h-full flex flex-col">
        <div className="aspect-square relative bg-[#f1f4fb] rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full p-6"
          />
        </div>
        <h3 className="font-semibold text-sm text-center text-[#1f2a44] leading-snug min-h-[44px]">
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
