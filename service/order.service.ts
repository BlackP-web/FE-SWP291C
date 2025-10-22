import { api } from "@/lib/api";

export const OrderService = {
  create: async (payload: any) => {
    const response = await api.post("/api/orders", payload);
    return response.data;
  },
};
