import axios from 'axios';

import i18n from 'app/i18n';
import { API_BASE_URL, REQUEST_TIMEOUT } from 'app/config/app';

export const requestHeaders = (token) => ({
  Authorization: token || '',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
});

export const paramsFilter = (params) => {
  const [language] = i18n.language.split('-');

  if (!params) {
    return {
      language,
    };
  }

  return {
    ...params,
    language,
  };
};

export const request = ({ url, params, ...options }, token) => {
  const headers = requestHeaders(token);
  const isApiRequest = !url.startsWith('^');

  let nextUrl = url;

  nextUrl = !isApiRequest
    ? nextUrl.slice(1)
    : nextUrl;

  if (nextUrl.startsWith('/')) {
    nextUrl = nextUrl.slice(1);
  }

  if (isApiRequest) {
    nextUrl = API_BASE_URL + nextUrl;
  } else if (!nextUrl.startsWith('/')) {
    nextUrl = `/${nextUrl}`;
  }

  const nextOptions = {
    url: nextUrl,
    method: options.method ? options.method.toUpperCase() : 'GET',
    params: paramsFilter(params),
    withCredentials: true,
    timeout: REQUEST_TIMEOUT,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  return axios(nextOptions)
    .then((response) => {
      const { data, status } = response;

      if (status < 300) {
        return data;
      }

      throw response;
    })
    .catch((err) => {
      throw err;
    });
};
