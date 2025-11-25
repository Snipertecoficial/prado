import { useState, useEffect } from "react";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            {namespace: "custom", key: "codigo"},
            {namespace: "custom", key: "comprimento_min"},
            {namespace: "custom", key: "comprimento_max"},
            {namespace: "custom", key: "peso"},
            {namespace: "custom", key: "tolerancia"}
          ]) {
            key
            value
            namespace
          }
          tags
        }
      }
    }
  }
`;

export const useProductSync = (refreshInterval = 30000, query?: string) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchProducts = async () => {
    try {
      const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, {
        first: 50,
        query: query || null,
      });

      const productsData = data.data.products?.edges || [];
      setProducts(productsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error syncing products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    const interval = setInterval(() => {
      fetchProducts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, query]);

  return { products, loading, lastUpdated, refresh: fetchProducts };
};
