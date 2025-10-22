import { api } from "@/lib/api";

export const OrderService = {
  create: async (payload: any) => {
    const response = await api.post("/api/orders", payload);
    return response.data;
  },
  getOrdersBySeller: async (sellerId: string) => {
    const response = await api.get(`/api/orders/seller/${sellerId}`);
    return response.data;
  },
  getOrdersByBuyer: async (sellerId: string) => {
    const response = await api.get(`/api/orders/buyer/${sellerId}`);
    return response.data;
  },
  updateStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/api/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },
  updateContract: async (orderId: string, contractUrl: string) => {
    const response = await api.patch(`/api/orders/${orderId}/contract`, {
      contractUrl,
    });
    return response.data;
  },
};
