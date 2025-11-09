import { api } from "@/lib/api";

export const PayosService = {
  createPayment: async (payload: any) => {
    const response = await api.post("/payos/create-payment", payload);
    return response;
  },
};
