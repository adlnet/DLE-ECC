'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { courseUrl } from '@/config/endpoints';
import { oneHour } from '@/config/timeConstants';
import { useQuery } from 'react-query';

export function getCourse(id) {
  if (!id) return null;
  return axiosInstance.get(courseUrl + id + '/').then((res) => res.data);
}

export function useCourse(courseId) {
  return useQuery(['course', courseId], () => getCourse(courseId), {
    staleTime: oneHour,
    cacheTime: oneHour,

    // keeps the data upto date with what is in the xis
    refetchOnMount: true,
  });
}
