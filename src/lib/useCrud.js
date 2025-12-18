// hooks/useCrud.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// lib/queryKeys.js
export const qk = {
  base: (entity) => ["crud", entity],
  list: (entity, params) => ["crud", entity, "list", params || {}],
  detail: (entity, id) => ["crud", entity, "detail", id],
};

// entity = something like "users" or "orders"
// api = an object containing your CRUD functions (getAll, create, update, remove)

export function useCrud(entity, api, listParams) {
  const qc = useQueryClient();
  const listKey = qk.list(entity, listParams);

  // console.log(listKey, "list  key");

  // ✅ GET LIST
  const list = useQuery({
    queryKey: listKey,
    queryFn: api.getAll,
    staleTime: 5 * 60 * 1000, // cache stays fresh for 5 mins
    gcTime: 10 * 60 * 1000, // garbage collected after 10 mins
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // GET ONE (Individual)
  const useOne = (id) =>
    useQuery({
      queryKey: qk.detail(entity, id),
      queryFn: () => api.getOne(id),
      enabled: !!id,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    });

  // ✅ CREATE
  const create = useMutation({
    mutationFn: (data) => api.create(data),

    // Optimistic update (update UI before server response)
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData(listKey);

      // Only update immediately if it's not FormData
      if (prev && !(input instanceof FormData)) {
        const optimistic = { ...input };
        qc.setQueryData(listKey, [...prev, optimistic]);
      }

      return { prev };
    },

    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
    },

    onSuccess: (created) => {
      qc.setQueryData(listKey, (curr) =>
        curr
          ? curr
              .map((item) => (item.id === created.id ? created : item))
              .concat(
                curr.find((item) => item.id === created.id) ? [] : [created]
              )
          : [created]
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: listKey, refetchType: "active" });
    },
  });

  // ✅ UPDATE
  const update = useMutation({
    mutationFn: ({ id, data }) => api.update(id, data),

    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData(listKey);
      // console.log(data, "checking data, id:", id, "prev:", prev);

      if (prev && !(data instanceof FormData)) {
        qc.setQueryData(
          listKey,
          prev.map((item) => (item.id === id ? { ...item, ...data } : item))
        );
      }

      return { prev };
    },

    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
    },

    onSuccess: (updated) => {
      console.log(update, "checking update");

      qc.setQueryData(listKey, (curr) =>
        curr
          ? curr.map((item) => (item.id === updated.id ? updated : item))
          : [updated]
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: listKey, refetchType: "active" });
    },
  });

  // ✅ DELETE
  const remove = useMutation({
    mutationFn: (id) => api.remove(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData(listKey);

      console.log(prev, "log prev data");

      if (prev) {
        qc.setQueryData(
          listKey,
          prev.filter((item) => item.id !== id)
        );
      }

      return { prev };
    },

    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: listKey, refetchType: "active" });
    },
  });

  // Return all operations
  return { list, create, update, remove, useOne };
}
