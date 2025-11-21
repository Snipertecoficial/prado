import { SHOPIFY_API_VERSION, SHOPIFY_DOMAIN } from "./shopify";

const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_API_TOKEN || "";

export interface StagedUploadTarget {
  resourceUrl: string;
  url: string;
  parameters: Array<{ name: string; value: string }>;
}

export interface AdminProductSummary {
  id: string;
  title: string;
  handle: string;
  status: string;
}

export interface AdminCollection {
  id: string;
  title: string;
  handle: string;
}

export interface AdminProductDetail {
  id: string;
  title: string;
  handle: string;
  status: string;
  descriptionHtml?: string | null;
  vendor?: string | null;
  productType?: string | null;
  tags?: string[] | null;
  options: Array<{ name: string; values: string[]; position: number }>;
  collections: AdminCollection[];
  variants: Array<{ id: string; price: { amount: string; currencyCode: string } }>;
  media: Array<{ id: string; alt: string | null; previewUrl: string; position: number }>;
}

export async function adminApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!ADMIN_ACCESS_TOKEN) {
    throw new Error("Token de API Admin não configurado. Defina VITE_SHOPIFY_ADMIN_API_TOKEN.");
  }

  if (!SHOPIFY_DOMAIN || !SHOPIFY_API_VERSION) {
    throw new Error(
      "Configuração da Shopify ausente. Defina VITE_SHOPIFY_DOMAIN e VITE_SHOPIFY_API_VERSION.",
    );
  }

  const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro na Admin API: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

const STAGED_UPLOADS_CREATE = `
  mutation generateStagedUploads($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters { name value }
      }
      userErrors { field message }
    }
  }
`;

export async function generateImageStagedUpload(file: File) {
  const variables = {
    input: [
      {
        resource: "IMAGE",
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size.toString(),
        httpMethod: "POST",
      },
    ],
  };

  const response = await adminApiRequest<{
    data: {
      stagedUploadsCreate: {
        stagedTargets: StagedUploadTarget[];
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(STAGED_UPLOADS_CREATE, variables);

  const { stagedTargets, userErrors } = response.data.stagedUploadsCreate;
  if (userErrors?.length) {
    throw new Error(userErrors.map(error => error.message).join(" | "));
  }

  return stagedTargets[0];
}

const PRODUCTS_SUMMARY_QUERY = `
  query adminProductsSummary($first: Int = 50) {
    products(first: $first, reverse: true) {
      edges {
        node {
          id
          title
          handle
          status
        }
      }
    }
  }
`;

export async function fetchAdminProducts(limit = 50) {
  const response = await adminApiRequest<{
    data: {
      products: {
        edges: Array<{
          node: AdminProductSummary;
        }>;
      };
    };
  }>(PRODUCTS_SUMMARY_QUERY, { first: limit });

  return response.data.products.edges.map(edge => edge.node);
}

const PRODUCT_DETAIL_QUERY = `
  query adminProductDetail($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      status
      descriptionHtml
      vendor
      productType
      tags
      options {
        name
        values
        position
      }
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
      variants(first: 5) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
      media(first: 40) {
        edges {
          node {
            ... on MediaImage {
              id
              alt
              mediaContentType
              position
              preview {
                image { url }
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchAdminProductDetail(id: string): Promise<AdminProductDetail> {
  const response = await adminApiRequest<{
    data: {
      product: {
        id: string;
        title: string;
        handle: string;
        status: string;
        descriptionHtml?: string | null;
        vendor?: string | null;
        productType?: string | null;
        tags?: string[] | null;
        options: Array<{ name: string; values: string[]; position: number }>;
        collections: {
          edges: Array<{ node: AdminCollection }>;
        };
        variants: { edges: Array<{ node: { id: string; price: { amount: string; currencyCode: string } } }> };
        media: {
          edges: Array<{
            node: {
              id: string;
              alt: string | null;
              mediaContentType: string;
              position: number;
              preview: { image: { url: string } };
            };
          }>;
        };
      };
    };
  }>(PRODUCT_DETAIL_QUERY, { id });

  const product = response.data.product;
  const media = product.media.edges
    .map(edge => edge.node)
    .filter(node => node.mediaContentType === "IMAGE")
    .map(node => ({
      id: node.id,
      alt: node.alt,
      previewUrl: node.preview.image.url,
      position: node.position,
    }))
    .sort((a, b) => a.position - b.position);

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    status: product.status,
    descriptionHtml: product.descriptionHtml,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags ?? [],
    options: product.options,
    collections: product.collections.edges.map(edge => edge.node),
    variants: product.variants.edges.map(edge => edge.node),
    media,
  };
}

const COLLECTIONS_QUERY = `
  query adminCollections($first: Int = 50) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export async function fetchCollections(limit = 50): Promise<AdminCollection[]> {
  const response = await adminApiRequest<{
    data: { collections: { edges: Array<{ node: AdminCollection }> } };
  }>(COLLECTIONS_QUERY, { first: limit });

  return response.data.collections.edges.map(edge => edge.node);
}

const PRODUCT_CREATE_MUTATION = `
  mutation adminProductCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product { id title handle status }
      userErrors { field message }
    }
  }
`;

export async function createAdminProduct(input: {
  title: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  status?: string;
  handle?: string;
  price?: string;
  options?: Array<{ name: string; values: string[] }>;
}) {
  const response = await adminApiRequest<{
    data: {
      productCreate: {
        product: AdminProductSummary | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_CREATE_MUTATION, {
    input: {
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      productType: input.productType,
      vendor: input.vendor,
      tags: input.tags,
      handle: input.handle,
      status: input.status ?? "DRAFT",
      options: input.options,
      variants: input.price
        ? [
            {
              price: input.price,
            },
          ]
        : undefined,
    },
  });

  const { product, userErrors } = response.data.productCreate;
  if (userErrors?.length) {
    throw new Error(userErrors.map(error => error.message).join(" | "));
  }

  return product;
}

const PRODUCT_UPDATE_MUTATION = `
  mutation adminProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id title handle status }
      userErrors { field message }
    }
  }
`;

export async function updateAdminProduct(input: {
  id: string;
  title?: string;
  descriptionHtml?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  status?: string;
  handle?: string;
  options?: Array<{ name: string; values: string[] }>;
  price?: string;
  variantId?: string;
}) {
  const response = await adminApiRequest<{
    data: {
      productUpdate: {
        product: AdminProductSummary | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_UPDATE_MUTATION, {
    input: {
      id: input.id,
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      productType: input.productType,
      vendor: input.vendor,
      tags: input.tags,
      status: input.status,
      handle: input.handle,
      options: input.options,
      variants:
        input.price && input.variantId
          ? [
              {
                id: input.variantId,
                price: input.price,
              },
            ]
          : undefined,
    },
  });

  const { userErrors } = response.data.productUpdate;
  if (userErrors?.length) {
    throw new Error(userErrors.map(error => error.message).join(" | "));
  }

  return response.data.productUpdate.product;
}

const COLLECTION_ADD_PRODUCTS = `
  mutation adminCollectionAddProducts($collectionId: ID!, $productIds: [ID!]!) {
    collectionAddProducts(collectionId: $collectionId, productIds: $productIds) {
      userErrors { field message }
    }
  }
`;

const COLLECTION_REMOVE_PRODUCTS = `
  mutation adminCollectionRemoveProducts($collectionId: ID!, $productIds: [ID!]!) {
    collectionRemoveProducts(collectionId: $collectionId, productIds: $productIds) {
      userErrors { field message }
    }
  }
`;

export async function addProductToCollections(collectionIds: string[], productId: string) {
  for (const collectionId of collectionIds) {
    const response = await adminApiRequest<{
      data: { collectionAddProducts: { userErrors: Array<{ field: string[]; message: string }> } };
    }>(COLLECTION_ADD_PRODUCTS, { collectionId, productIds: [productId] });

    const { userErrors } = response.data.collectionAddProducts;
    if (userErrors?.length) {
      throw new Error(userErrors.map(error => error.message).join(" | "));
    }
  }
}

export async function removeProductFromCollections(collectionIds: string[], productId: string) {
  for (const collectionId of collectionIds) {
    const response = await adminApiRequest<{
      data: { collectionRemoveProducts: { userErrors: Array<{ field: string[]; message: string }> } };
    }>(COLLECTION_REMOVE_PRODUCTS, { collectionId, productIds: [productId] });

    const { userErrors } = response.data.collectionRemoveProducts;
    if (userErrors?.length) {
      throw new Error(userErrors.map(error => error.message).join(" | "));
    }
  }
}

const PRODUCT_CREATE_MEDIA = `
  mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        id
        alt
        mediaContentType
        preview { image { url } }
      }
      mediaUserErrors { field message }
    }
  }
`;

export async function createProductMedia(productId: string, media: Array<{ originalSource: string; alt?: string | null }>) {
  const response = await adminApiRequest<{
    data: {
      productCreateMedia: {
        media: Array<{
          id: string;
          alt: string | null;
          mediaContentType: string;
          preview: { image: { url: string } };
        }>;
        mediaUserErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_CREATE_MEDIA, {
    productId,
    media: media.map(item => ({
      mediaContentType: "IMAGE",
      originalSource: item.originalSource,
      alt: item.alt,
    })),
  });

  const { mediaUserErrors } = response.data.productCreateMedia;
  if (mediaUserErrors?.length) {
    throw new Error(mediaUserErrors.map(error => error.message).join(" | "));
  }

  return response.data.productCreateMedia.media;
}

const PRODUCT_UPDATE_MEDIA = `
  mutation productUpdateMedia($productId: ID!, $media: [UpdateMediaInput!]!, $mediaIdsToDelete: [ID!]) {
    productUpdateMedia(productId: $productId, media: $media, mediaIdsToDelete: $mediaIdsToDelete) {
      media {
        id
        alt
        mediaContentType
        preview { image { url } }
      }
      mediaUserErrors { field message }
    }
  }
`;

export async function updateProductMedia(
  productId: string,
  media: Array<{ id: string; alt?: string | null; position: number }>,
  mediaIdsToDelete?: string[],
) {
  const response = await adminApiRequest<{
    data: {
      productUpdateMedia: {
        media: Array<{
          id: string;
          alt: string | null;
          mediaContentType: string;
          preview: { image: { url: string } };
        }>;
        mediaUserErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(PRODUCT_UPDATE_MEDIA, {
    productId,
    media,
    mediaIdsToDelete,
  });

  const { mediaUserErrors } = response.data.productUpdateMedia;
  if (mediaUserErrors?.length) {
    throw new Error(mediaUserErrors.map(error => error.message).join(" | "));
  }

  return response.data.productUpdateMedia.media;
}

const METAFIELDS_SET_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key namespace value }
      userErrors { field message }
    }
  }
`;

export async function setMediaMetafield(productId: string, value: unknown) {
  const metafieldValue = JSON.stringify(value);
  const response = await adminApiRequest<{
    data: {
      metafieldsSet: {
        userErrors: Array<{ field: string[]; message: string }>;
      };
    };
  }>(METAFIELDS_SET_MUTATION, {
    metafields: [
      {
        ownerId: productId,
        namespace: "custom",
        key: "media_gallery",
        type: "json",
        value: metafieldValue,
      },
    ],
  });

  const { userErrors } = response.data.metafieldsSet;
  if (userErrors?.length) {
    throw new Error(userErrors.map(error => error.message).join(" | "));
  }
}

