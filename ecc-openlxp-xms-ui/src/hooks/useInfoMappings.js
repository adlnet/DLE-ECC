import { axiosInstance } from '../config/axiosInstance';
import { twentyFourHours } from '../config/timeConstants';
import { uiConfigUrl } from '../config/endpoints';
import { useQuery } from 'react-query';

/**
 * @description Reaches out to the backend and gets the configuration data required for the application. Valid for 24hrs
 */

export function useInfoMappings() {
  return useQuery(
    'ui-config',
    () => axiosInstance.get(uiConfigUrl).then((res) => res.data),
    {
      staleTime: twentyFourHours,
      cacheTime: twentyFourHours,
    }
  );
}
