'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import {interestLists} from "@/config/endpoints";
import {useMutation, useQueryClient} from "react-query";

export function useUnsubscribeFromList() {
  const queryClient = useQueryClient();
  return useMutation(
    ({id}) => axiosInstance.patch(interestLists + id + "/unsubscribe", {}, {
    }).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('interestLists');
        queryClient.invalidateQueries('subscribedLists');
      }
    }
  );
}
