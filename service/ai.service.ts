import { api } from "@/lib/api";

export const AiService = {
  compareAiService: async (payload: any) => {
    const response = await api.post("/api/ai/compare", payload);
    return response;
  },
};
