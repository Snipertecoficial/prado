import { useState, useEffect } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
}

const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

export const useShopifyCollections = (limit = 20) => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const data = await storefrontApiRequest(GET_COLLECTIONS_QUERY, {
          first: limit,
        });

        const collectionsData = data.data.collections?.edges || [];
        setCollections(collectionsData.map((edge: any) => edge.node));
        setError(null);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Erro ao carregar coleções");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [limit]);

  return { collections, loading, error };
};
