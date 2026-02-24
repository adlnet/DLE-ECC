'use strict';

import { useQuery } from 'react-query';

import { axiosInstance } from '@/config/axiosConfig';
import { saveSearchOwnedUrl } from '@/config/endpoints';

const getSavedSearch = (token) => {
  return () => axiosInstance.get(saveSearchOwnedUrl).then((res) => res.data);
};

export const useSaveSearchList = (token) => {
  return useQuery(['saved-search-list'], getSavedSearch(token), {
    retry: false,
  });
};
