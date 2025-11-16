import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, CartItem } from '@/lib/shopify';

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        set({ items: [...items, item] });
      },

      clearCart: () => {
        set({ items: [], checkoutUrl: null });
      },

      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        set({ isLoading: true });
        try {
          const { items } = get();
          if (items.length === 0) {
            throw new Error('Carrinho vazio');
          }

          const checkoutUrl = await createStorefrontCheckout(items);
          set({ checkoutUrl });
          
          // Open checkout in new tab
          window.open(checkoutUrl, '_blank');
          
          // Clear cart after successful checkout
          get().clearCart();
        } catch (error) {
          console.error('Erro ao criar checkout:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
