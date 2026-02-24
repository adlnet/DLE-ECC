'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { interestLists } from '@/config/endpoints';
import { useMutation, useQueryClient } from 'react-query';

const updateUserList = ({ id, listData }, token) => {
  return axiosInstance.patch(interestLists + id, listData, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export function useUpdateUserList(token) {
  const queryClient = useQueryClient();
  return useMutation((values) => updateUserList(values, token), {
    onSuccess: (newList) => {
      // refetching the data once a res.ok response is confirmed
      queryClient.refetchQueries(['user-owned-lists'], {});
      queryClient.refetchQueries(['list', newList.id], {});
    },
  });
}
