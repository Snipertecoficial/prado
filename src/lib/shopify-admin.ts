import { SHOPIFY_API_VERSION, SHOPIFY_DOMAIN } from "./shopify";

const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
const ADMIN_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ADMIN_API_TOKEN || "";

export interface StagedUploadTarget {
  resourceUrl: string;
  url: string;
  parameters: Array<{ name: string; value: string }>;
}

  if (!ADMIN_ACCESS_TOKEN) {
    throw new Error("Token de API Admin não configurado. Defina VITE_SHOPIFY_ADMIN_API_TOKEN.");
  }

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

export { adminApiRequest };
