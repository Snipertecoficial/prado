import { ProdutoConfig } from "@/types/product";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || "lovable-project-969u3.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_TOKEN;
const API_VERSION = "2024-10";

if (!SHOPIFY_ADMIN_TOKEN) {
  console.warn("Shopify Admin API token não configurado (VITE_SHOPIFY_ADMIN_TOKEN)");
}

const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

interface ShopifyAdminResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface AdminProductSummary {
  id: string;
  title: string;
  status?: string;
  variantId?: string;
  variantPrice?: string;
}

export interface ProductConfigResult {
  product?: AdminProductSummary;
  metafieldValue?: ProdutoConfig;
}

async function adminApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN || "",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const message = `Erro na Shopify Admin API: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const data: ShopifyAdminResponse<T> = await response.json();

  if (data.errors?.length) {
    throw new Error(data.errors.map((err) => err.message).join(", "));
  }

  return data as T;
}

const PRODUCTS_QUERY = `
  query getAdminProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          status
          variants(first: 1) {
            edges {
              node {
                id
                price
              }
            }
          }
        }
      }
    }
  }
`;

export async function getAdminProducts(first = 20): Promise<AdminProductSummary[]> {
  const result = await adminApiRequest<{
    data: {
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            status: string;
            variants: { edges: Array<{ node: { id: string; price: string } }> };
          };
        }>;
      };
    };
  }>(PRODUCTS_QUERY, { first });

  return result.data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    status: node.status,
    variantId: node.variants.edges[0]?.node.id,
    variantPrice: node.variants.edges[0]?.node.price,
  }));
}

const PRODUCT_WITH_CONFIG_QUERY = `
  query getProductWithConfig($id: ID!, $namespace: String!, $key: String!) {
    product(id: $id) {
      id
      title
      status
      variants(first: 1) {
        edges {
          node {
            id
            price
          }
        }
      }
      metafields(identifiers: [{ namespace: $namespace, key: $key }]) {
        key
        namespace
        type
        value
      }
    }
  }
`;

export async function getProductConfig(
  id: string,
  namespace: string,
  key: string
): Promise<ProductConfigResult> {
  const result = await adminApiRequest<{
    data: {
      product: {
        id: string;
        title: string;
        status: string;
        variants: { edges: Array<{ node: { id: string; price: string } }> };
        metafields: Array<{ key: string; namespace: string; value: string }>;
      } | null;
    };
  }>(PRODUCT_WITH_CONFIG_QUERY, { id, namespace, key });

  const product = result.data.product;

  if (!product) {
    throw new Error("Produto não encontrado na Shopify");
  }

  const metafieldRaw = product.metafields?.[0]?.value;
  let metafieldValue: ProdutoConfig | undefined;
  if (metafieldRaw) {
    try {
      metafieldValue = JSON.parse(metafieldRaw) as ProdutoConfig;
    } catch (error) {
      console.warn("Não foi possível converter o metafield de configuração", error);
    }
  }

  return {
    product: {
      id: product.id,
      title: product.title,
      status: product.status,
      variantId: product.variants.edges[0]?.node.id,
      variantPrice: product.variants.edges[0]?.node.price,
    },
    metafieldValue,
  };
}

const METAFIELDS_SET_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        namespace
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function setProductMetafield(
  ownerId: string,
  namespace: string,
  key: string,
  value: ProdutoConfig
) {
  const response = await adminApiRequest<{
    data: {
      metafieldsSet: {
        metafields: Array<{ id: string; key: string }>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(METAFIELDS_SET_MUTATION, {
    metafields: [
      {
        ownerId,
        namespace,
        key,
        type: "json",
        value: JSON.stringify(value),
      },
    ],
  });

  const errors = response.data.metafieldsSet.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  return response.data.metafieldsSet.metafields;
}

const PRODUCTS_CREATE_MUTATION = `
  mutation productsCreate($products: [ProductInput!]!) {
    productsCreate(products: $products) {
      products {
        id
        title
        status
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createProductWithVariant(config: ProdutoConfig) {
  const response = await adminApiRequest<{
    data: {
      productsCreate: {
        products: Array<{
          id: string;
          title: string;
          status: string;
          variants: { edges: Array<{ node: { id: string; price: string } }> };
        }>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCTS_CREATE_MUTATION, {
    products: [
      {
        title: config.nome,
        descriptionHtml: config.descricaoTecnica || "",
        status: "ACTIVE",
        variants: [
          {
            price: config.precoPorMetro.toFixed(2),
            title: config.nome,
          },
        ],
      },
    ],
  });

  const errors = response.data.productsCreate.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  const created = response.data.productsCreate.products?.[0];
  if (!created) {
    throw new Error("Produto não foi criado pela Shopify");
  }

  return {
    id: created.id,
    title: created.title,
    status: created.status,
    variantId: created.variants.edges[0]?.node.id,
    variantPrice: created.variants.edges[0]?.node.price,
  } as AdminProductSummary;
}

const PRODUCT_VARIANT_CREATE_MUTATION = `
  mutation productVariantCreate($input: ProductVariantInput!) {
    productVariantCreate(input: $input) {
      productVariant {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createProductVariant(productId: string, price: number, title?: string) {
  const response = await adminApiRequest<{
    data: {
      productVariantCreate: {
        productVariant: { id: string; price: string } | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_VARIANT_CREATE_MUTATION, {
    input: {
      productId,
      price: price.toFixed(2),
      title,
    },
  });

  const errors = response.data.productVariantCreate.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  const variant = response.data.productVariantCreate.productVariant;
  if (!variant) {
    throw new Error("Variant não foi criado");
  }

  return variant;
}

const PRODUCT_VARIANT_UPDATE_MUTATION = `
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function updateProductVariantPrice(variantId: string, price: number) {
  const response = await adminApiRequest<{
    data: {
      productVariantUpdate: {
        productVariant: { id: string; price: string } | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_VARIANT_UPDATE_MUTATION, {
    input: {
      id: variantId,
      price: price.toFixed(2),
    },
  });

  const errors = response.data.productVariantUpdate.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  const variant = response.data.productVariantUpdate.productVariant;
  if (!variant) {
    throw new Error("Variant não foi atualizado");
  }

  return variant;
}
