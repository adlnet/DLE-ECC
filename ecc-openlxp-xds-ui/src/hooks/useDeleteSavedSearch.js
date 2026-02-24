'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { saveSearchUrl } from '@/config/endpoints';
import { useMutation, useQueryClient } from 'react-query';

const deleteSearch = (id, token) => {
  return axiosInstance
    .delete(`${saveSearchUrl}/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data);
};

export function useDeleteSavedSearch(token) {
  const queryClient = useQueryClient();

  return useMutation(({ id }) => deleteSearch(id, token), {
    onSettled: () => {
      queryClient.invalidateQueries(['saved-search-list']);
    },
  });
}
