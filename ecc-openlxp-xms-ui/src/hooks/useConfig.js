import { axiosInstance } from '../config/axiosInstance';
import { ssoURL } from '../config/endpoints';
import { twentyFourHours } from '../config/timeConstants';
import { useQuery } from 'react-query';

/**
 * @description Reaches out to the backend and gets the configuration data required for the application. Valid for 24hrs
 */

export function useConfig() {
  return useQuery(
    'ui-config',
    () => axiosInstance.get(ssoURL).then((res) => res.data),
    {
      staleTime: twentyFourHours,
      cacheTime: twentyFourHours,
    }
  );
}
