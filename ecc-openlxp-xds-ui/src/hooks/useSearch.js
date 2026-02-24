'use strict';

import { axiosInstance } from '@/config/axiosConfig';
import { searchUrl } from '@/config/endpoints';
import { tenMinutes } from '@/config/timeConstants';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import queryString from 'query-string';

const getSearchResults = (searchTerm) => {
  return axiosInstance.get(searchTerm).then((res) => res.data);
};

function makePath(params) {
  return `${searchUrl}?${queryString.stringify(params)}`;
}

/**
 * Hook to get search results
 * @returns the state of the url, a setter for the url, and all the attributes from the query
 */

export function useSearch(queryObject) {
  const { query } = useRouter();

  // state of the search term
  const [url, setNewUrl] = useState(makePath(query));

  // set new search term
  const setUrl = (queryParams) => {
    setNewUrl(makePath(queryParams));
  };

  // access to the client
  const queryClient = useQueryClient();

  const searchQuery = useQuery(['search', url], () => getSearchResults(url), {
    staleTime: tenMinutes,
    onSuccess: (data) => {
      // add each of the hits to the query client as a course
      // the hit.meta.id is the same as the metadata_key_hash
      for (const hit of data?.hits || []) {
        queryClient.setQueryData(['course', hit.meta.id], hit);
      }
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (!isMounted) return;
    searchQuery.refetch();
    return () => {
      isMounted = false;
    };
  }, [queryObject, url]);

  // return the state of the url, the setter, and all the attributes from the query
  return {
    url,
    setUrl,
    ...searchQuery,
  };
}
