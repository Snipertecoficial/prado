import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminProductSummary,
  createProductVariant,
  createProductWithVariant,
  getAdminProducts,
  getProductConfig,
  setProductMetafield,
  updateProductVariantPrice,
} from "@/lib/shopify-admin";
import { PRODUTO_DEFAULT_CONFIG, ProdutoConfig } from "@/types/product";
import { useToast } from "./use-toast";

const METAFIELD_NAMESPACE = "configurador";
const METAFIELD_KEY = "perfil_config";

interface UseShopifyProductConfigReturn {
  products: AdminProductSummary[];
  produtoConfig: ProdutoConfig;
  setProdutoConfig: (config: ProdutoConfig) => void;
  selectedProductId?: string;
  selectedVariantId?: string;
  isLoading: boolean;
  isSaving: boolean;
  loadProducts: () => Promise<void>;
  handleSelectProduct: (productId: string) => Promise<void>;
  handleCreateProduct: () => Promise<void>;
  handleSaveConfig: () => Promise<void>;
  lastError?: string;
}

function mergeConfig(base: ProdutoConfig, incoming?: ProdutoConfig) {
  if (!incoming) return base;
  return {
    ...base,
    ...incoming,
  };
}

export function useShopifyProductConfig(): UseShopifyProductConfigReturn {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [produtoConfig, setProdutoConfigState] = useState<ProdutoConfig>(PRODUTO_DEFAULT_CONFIG);
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<string>();

  const setProdutoConfig = useCallback((config: ProdutoConfig) => {
    setProdutoConfigState(config);
  }, []);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setLastError(undefined);
    try {
      const lista = await getAdminProducts();
      setProducts(lista);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro ao carregar produtos";
      setLastError(message);
      toast({
        title: "Erro ao carregar produtos",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSelectProduct = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      setLastError(undefined);
      try {
        const response = await getProductConfig(productId, METAFIELD_NAMESPACE, METAFIELD_KEY);
        setSelectedProductId(productId);
        setSelectedVariantId(response.product?.variantId);

        const mergedConfig = mergeConfig(PRODUTO_DEFAULT_CONFIG, response.metafieldValue);
        mergedConfig.id = productId;
        if (!response.metafieldValue && response.product?.title) {
          mergedConfig.nome = response.product.title;
        }
        if (!response.metafieldValue && response.product?.variantPrice) {
          mergedConfig.precoPorMetro = Number(response.product.variantPrice);
        }

        setProdutoConfigState(mergedConfig);
        toast({
          title: "Produto carregado",
          description: "Configurações sincronizadas com a Shopify",
        });
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Erro ao carregar produto";
        setLastError(message);
        toast({
          title: "Erro ao carregar produto",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleCreateProduct = useCallback(async () => {
    setIsSaving(true);
    setLastError(undefined);
    try {
      const created = await createProductWithVariant(produtoConfig);
      setProducts((prev) => [created, ...prev]);
      setSelectedProductId(created.id);
      setSelectedVariantId(created.variantId);
      setProdutoConfigState((prev) => ({ ...prev, id: created.id }));

      await setProductMetafield(created.id, METAFIELD_NAMESPACE, METAFIELD_KEY, {
        ...produtoConfig,
        id: created.id,
      });

      toast({
        title: "Produto criado",
        description: "Configuração salva como metafield",
      });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro ao criar produto";
      setLastError(message);
      toast({
        title: "Erro ao criar produto",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [produtoConfig, toast]);

  const ensureVariant = useCallback(
    async (productId: string, variantId?: string): Promise<string> => {
      if (variantId) return variantId;
      const createdVariant = await createProductVariant(productId, produtoConfig.precoPorMetro, produtoConfig.nome);
      setSelectedVariantId(createdVariant.id);
      return createdVariant.id;
    },
    [produtoConfig.nome, produtoConfig.precoPorMetro]
  );

  const handleSaveConfig = useCallback(async () => {
    if (!selectedProductId) {
      toast({
        title: "Selecione um produto",
        description: "Escolha ou crie um produto para salvar a configuração",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setLastError(undefined);
    try {
      const variantId = await ensureVariant(selectedProductId, selectedVariantId);
      await updateProductVariantPrice(variantId, produtoConfig.precoPorMetro);
      await setProductMetafield(selectedProductId, METAFIELD_NAMESPACE, METAFIELD_KEY, {
        ...produtoConfig,
        id: selectedProductId,
      });

      toast({
        title: "Configuração salva",
        description: "Dados enviados para a Shopify com sucesso",
      });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Erro ao salvar configuração";
      setLastError(message);
      toast({
        title: "Erro ao salvar",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [ensureVariant, produtoConfig, selectedProductId, selectedVariantId, toast]);

  const state: UseShopifyProductConfigReturn = useMemo(
    () => ({
      products,
      produtoConfig,
      setProdutoConfig,
      selectedProductId,
      selectedVariantId,
      isLoading,
      isSaving,
      loadProducts,
      handleSelectProduct,
      handleCreateProduct,
      handleSaveConfig,
      lastError,
    }),
    [
      products,
      produtoConfig,
      setProdutoConfig,
      selectedProductId,
      selectedVariantId,
      isLoading,
      isSaving,
      loadProducts,
      handleSelectProduct,
      handleCreateProduct,
      handleSaveConfig,
      lastError,
    ]
  );

  return state;
}
