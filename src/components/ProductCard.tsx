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
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full p-4"
          />
        </div>
        <h3 className="font-semibold text-sm text-center mb-2 min-h-[40px]">
          {product.name}
        </h3>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary mb-1">
            {formatarPreco(product.price)}
          </p>
          {product.installmentPrice && product.installments && (
            <p className="text-xs text-muted-foreground">
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
