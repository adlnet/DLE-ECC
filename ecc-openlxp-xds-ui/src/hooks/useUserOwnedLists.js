'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { oneMinute } from '@/config/timeConstants';
import { useQuery, useQueryClient } from 'react-query';
import { userOwnedLists } from '@/config/endpoints';
const getUserLists = () => {
  return () => axiosInstance.get(userOwnedLists).then((res) => res.data);
};

export function useUserOwnedLists() {
  const queryClient = useQueryClient();
  return useQuery(['user-owned-lists'], getUserLists(), {
    staleTime: oneMinute,
    onSuccess: (data) => {
      // update the cache
      data?.map((list) =>
        queryClient.setQueryData(['list', list.id], list)
      );
    },
  });
}
