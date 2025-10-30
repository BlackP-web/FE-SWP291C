import { api } from "@/lib/api";

export const FavoriteService = {
  toggleFavorite: async (payload: any) => {
    const response = await api.post("/api/favorites/toggle", payload);
    return response.data;
  },
  getFavorites: async (userId: string) => {
    const response = await api.get(`/api/favorites/${userId}`);
    return response.data;
  },
};
