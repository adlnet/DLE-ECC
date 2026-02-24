'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { saveSearchUrl } from '@/config/endpoints';
import { useMutation, useQueryClient } from 'react-query';

const createSavedSearch = ({ path, name }, token) => {
  return axiosInstance
    .post(
      saveSearchUrl,
      { query: path, name: name },
    )
    .then((res) => res.data);
};

export function useCreateSaveSearch(token) {
  const queryClient = useQueryClient();

  return useMutation((value) => createSavedSearch(value, token), {
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-search-list']);
      queryClient.refetchQueries(['saved-search-list']);
    },
  });
}
