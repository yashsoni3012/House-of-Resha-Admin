// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/userApi';

// Helper to get user fields with fallbacks
export const getUserField = (user, fieldNames) => {
  if (!user) return 'N/A';

  for (let field of fieldNames) {
    const value = user[field];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return 'N/A';
};

// Custom query options
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
};

// Hook for active users
export const useActiveUsers = () => {
  return useQuery({
    queryKey: ['users', 'active'],
    queryFn: userApi.getActiveUsers,
    ...defaultQueryOptions,
  });
};

// Hook for inactive users
export const useInactiveUsers = () => {
  return useQuery({
    queryKey: ['users', 'inactive'],
    queryFn: userApi.getInactiveUsers,
    ...defaultQueryOptions,
  });
};

// Hook for user statistics
export const useUserStats = () => {
  const { data: activeUsers = [] } = useActiveUsers();
  const { data: inactiveUsers = [] } = useInactiveUsers();

  return {
    active: activeUsers.length,
    inactive: inactiveUsers.length,
    total: activeUsers.length + inactiveUsers.length,
    verified: Math.round((activeUsers.length + inactiveUsers.length) * 0.85),
  };
};

// Mutation for updating user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }) => userApi.updateUserStatus(userId, status),
    onMutate: async ({ userId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot the previous value
      const previousActive = queryClient.getQueryData(['users', 'active']);
      const previousInactive = queryClient.getQueryData(['users', 'inactive']);

      // Optimistically update to the new value
      const updateUserInList = (list) =>
        list.map(user => user.id === userId ? { ...user, status } : user);

      if (status === 'active') {
        queryClient.setQueryData(['users', 'active'], updateUserInList);
        queryClient.setQueryData(['users', 'inactive'],
          previousInactive?.filter(user => user.id !== userId) || []);
      } else {
        queryClient.setQueryData(['users', 'inactive'], updateUserInList);
        queryClient.setQueryData(['users', 'active'],
          previousActive?.filter(user => user.id !== userId) || []);
      }

      return { previousActive, previousInactive };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousActive) {
        queryClient.setQueryData(['users', 'active'], context.previousActive);
      }
      if (context?.previousInactive) {
        queryClient.setQueryData(['users', 'inactive'], context.previousInactive);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook for exporting users
export const useExportUsers = () => {
  return useMutation({
    mutationFn: (filters) => userApi.exportUsers(filters),
    onSuccess: (data) => {
      // Create download link for CSV
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });
};