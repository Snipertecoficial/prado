// Shopify Storefront API Configuration
const SHOPIFY_DOMAIN = 'lovable-project-969u3.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '61a24389861a98e0d01e2290d3f4eb8f';
const API_VERSION = '2025-07';

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export interface CartItem {
  variantId: string;
  quantity: number;
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

// Storefront API request function
export async function storefrontApiRequest(query: string, variables: any = {}) {
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

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: any) => e.message).join(', ')}`);
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
