'use strict';

export const host = process.env.NEXT_PUBLIC_XMS_BACKEND
const api = 'api/';

//catalogs
export const catalogs_url = `${host}${api}catalogs/`;

export const catalog_courses_url = `${host}${api}catalogs/`

//user login/register
export const login_url = `${host}${api}auth/login`
export const register_url = `${host}${api}auth/register`

//configs
export const configUrl = `${host}${api}config/catalogs/`

//sso configs
export const ssoURL = `${host}${api}config/sso/`

//UI information mappings
export const uiConfigUrl = `${host}${api}config/info-mapping/`;
