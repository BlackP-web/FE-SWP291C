import { api } from "@/lib/api";

export const CartService = {
  addToCart: async (payload: any) => {
    const response = await api.post("/api/cart/add", payload);
    return response.data;
  },

  removeFromCart: async (listingId: string, userId?: string) => {
    const response = await api.delete(`/api/cart/remove/${listingId}`, {
      data: { userId },
    });
    return response.data;
  },

  getCartByUser: async (userId: string) => {
    const response = await api.get(`/api/cart/${userId}`);
    return response.data;
  },
};
