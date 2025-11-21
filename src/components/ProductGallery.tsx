import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ProductImage = {
  url: string;
  altText?: string | null;
};

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

const ProductGallery = ({ images, className }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images.length]);

  const selectedImage = images[selectedIndex];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-muted rounded-lg p-6 flex items-center justify-center min-h-[320px]">
        {selectedImage ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.altText || "Imagem do produto"}
            className="max-h-[360px] w-auto object-contain"
          />
        ) : (
          <div className="h-[320px] flex items-center justify-center text-muted-foreground">
            Sem imagem disponível
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "border rounded-md overflow-hidden aspect-square bg-muted/40 hover:border-primary transition",
                selectedIndex === index && "ring-2 ring-primary border-primary",
              )}
            >
              <img
                src={image.url}
                alt={image.altText || `Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
