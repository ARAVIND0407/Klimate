import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseLocalStorage } from "./use-local-storage";

interface FavoriteCity {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  AddedAt: number;
}

export function UseFavorite() {
  const [favorites, SetFavorites] = UseLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );

  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const AddFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "AddedAt">) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        AddedAt: Date.now(),
      };

      const exists = favorites.some((fav) => fav.id === newFavorite.id);
      if (exists) return favorites;

      const newFavorites = [...favorites, newFavorite].slice(0, 10);
      SetFavorites(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const RemoveFavorites = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((fav) => fav.id !== cityId);
      SetFavorites(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  return {
    favorites: favoritesQuery.data ?? [],
    AddFavorite: AddFavorite,
    RemoveFavorites,
  };
}
