import { axiosInstance } from '@/config/axiosConfig';
import { unreadData } from '@/config/endpoints';
import { useQuery } from 'react-query';

export const getUnreadData = () => {
  return () => axiosInstance.get(unreadData).then((res) => res.data);
};

export const useUnreadData = (token) => {
    return useQuery(['unread-notifications-list'], getUnreadData(), {
      retry: false,
    });
  };