'use strict';

import { searchUrl } from '../config/endpoints';
import { useState } from 'react';
import queryString from 'node:querystring';

function makePath(params) {
  return `${searchUrl}?${queryString.stringify(params)}`;
}

export function useSearchUrl(initialQuery = {}) {
  const [url, setNewUrl] = useState(() => makePath(initialQuery));

  const setUrl = (params) => {
    setNewUrl(makePath(params));
  };
  return { url, setUrl };
}
