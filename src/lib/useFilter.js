import { useQuery } from "@tanstack/react-query";

// qk.filter = ["crud", entity, "filter", params]
export const qk = {
  filter: (entity, params) => ["filter", entity, params || {}],
};

export function useFilter(entity, api, params = {}) {
  return useQuery({
    queryKey: qk.filter(entity, params),
    queryFn: api.getAll,
    enabled: !!params,        // runs only when params exist
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}
