// Shopify Storefront API Configuration (namespaced to avoid collisions)
export const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const STOREFRONT_ACCESS_TOKEN = import.meta.env
  .VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined;
export const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-07";

const STOREFRONT_API_URL =
  SHOPIFY_STORE_DOMAIN && SHOPIFY_API_VERSION
    ? `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
    : undefined;

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
}

export interface CartItem {
  variantId: string;
  quantity: number;
  product: ShopifyProduct;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

// Storefront API request function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN || !STOREFRONT_API_URL) {
    throw new Error(
      "Configuração da Shopify ausente. Defina VITE_SHOPIFY_DOMAIN e VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return response.json();
}

// Cart Create Mutation
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
              attributes {
                key
                value
              }
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

// Create checkout function with custom attributes
export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  try {
    // Format cart lines for Shopify
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
      attributes: item.attributes || [],
    }));

    // Create cart with initial items
    const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
      input: {
        lines,
      },
    });

    const userErrors = cartData.data.cartCreate
      .userErrors as Array<{ message: string }>;

    if (userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${userErrors.map(error => error.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;
    
    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    const checkoutUrl = url.toString();
    return checkoutUrl;
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}

// Query to get products
const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(first: number = 10) {
  const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, { first });
  return data.data.products.edges;
}
