'use strict';

import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
});
