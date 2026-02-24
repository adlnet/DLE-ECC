'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { interestLists } from '@/config/endpoints';
import { oneMinute } from '@/config/timeConstants';
import { useQuery, useQueryClient } from 'react-query';

export function useSubscribedLists() {
  const queryClient = useQueryClient();
  return useQuery('subscribedLists', () =>
    axiosInstance.get(interestLists + 'subscriptions').then((res) => res.data),{
      staleTime: oneMinute,
      onSuccess: (data) => {
        // update the cache
        data?.map((list) =>
          queryClient.setQueryData(['list', list.id], list)
        );
      },
    }
  );
}
