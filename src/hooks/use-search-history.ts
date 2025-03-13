import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseLocalStorage } from "./use-local-storage";

interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function UseSearchHistory() {
  const [history, SetHistory] = UseLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => history,
    initialData: history,
  });

  const AddToHistory = useMutation({
    mutationFn: async (
      search: Omit<SearchHistoryItem, "id" | "searchedAt">
    ) => {
      const newSearch: SearchHistoryItem = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      const filteredHistory = history.filter(
        (item) => !(item.lat === search.lat && item.lon === search.lon)
      );

      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      SetHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory)=>{
        queryClient.setQueryData(["search-history"], newHistory)
    },
  });

  const ClearHistory = useMutation({
    mutationFn: async () => {
        SetHistory([]);
        return [];
    },
    onSuccess: ()=>{
        queryClient.setQueryData(["search-history"], [])
    }
  });

  return{
    history: historyQuery.data?? [],
    AddToHistory,
    ClearHistory
  }
}
