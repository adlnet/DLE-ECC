'use strict';

import { allRead } from '@/config/endpoints';
import { axiosInstance } from '@/config/axiosConfig';

export const getAllRead = () => {
  return () => axiosInstance.get(allRead).then((res) => res.data);
};

