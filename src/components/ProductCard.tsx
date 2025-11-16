import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { formatarPreco } from "@/lib/calculations";

interface ProductCardProps {
  product: Product;
  onConfigure?: () => void;
}

const ProductCard = ({ product, onConfigure }: ProductCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-accent hover:bg-accent/90" 
          onClick={onConfigure}
        >
          Configurar Produto
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
