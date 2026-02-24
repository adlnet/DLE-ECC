'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { interestLists } from '@/config/endpoints';
import { useQuery, useQueryClient } from 'react-query';

export function getList(id) {
  if (!id) return;
  return axiosInstance.get(interestLists + id).then((res) => res.data);
}

export function useList(id) {
  const queryClient = useQueryClient();
  return useQuery(['list', id], () => getList(id), {
    onSuccess: (data) => {
      // optimistically update the cache with the new experience data
      // this data is from xis so the id from search is now the metadata_key_hash
      for (const experience of data?.experiences || []) {
        queryClient.setQueryData(
          ['course', experience?.meta?.metadata_key_hash],
          experience
        );
        }
    },
  });
}
