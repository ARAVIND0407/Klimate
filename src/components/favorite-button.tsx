import type { WeatherData } from "@/api/types";
import { UseFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData;
}

const FavoriteButton = ({ data }: FavoriteButtonProps) => {
  const { AddFavorite, RemoveFavorites, favorites } = UseFavorite();

  const isCurrentlyFavorite = favorites.some(
    (fav) => fav.lat === data.coord.lat && fav.lon === data.coord.lon
  );

  const HandleToggleFavourite = () => {
    if (isCurrentlyFavorite) {
      RemoveFavorites.mutate(`${data.coord.lat}-${data.coord.lon}`, {
        onSuccess: () => {
          toast.error(`Removed ${data.name} from favorites`);
        },
      });
    } else {
      AddFavorite.mutate(
        {
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          country: data.sys.country,
        },
        {
          onSuccess: () => {
            toast.success(`Added ${data.name} to favorites`);
          },
        }
      );
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size={"icon"}
      className={`${
        isCurrentlyFavorite ? "bg-yellow-500" : "hover:bg-yellow-600"
      }`}
      onClick={HandleToggleFavourite}
    >
      <Star className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavoriteButton;
