import { api } from "@/lib/api";

export const FavoriteService = {
  toggleFavorite: async (payload: any) => {
    const response = await api.post("/api/favorites/toggle", payload);
    return response.data;
  },
};
