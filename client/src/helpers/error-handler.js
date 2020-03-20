import _ from 'underscore';

import i18next from 'i18next';

const NETWORK_ERROR_REDIRECT_PATH = null;

const messages = {};

i18next.loadNamespaces('error', () => {
  messages.networkError = i18next.t('error:messages.networkError');
  messages.defaultError = i18next.t('error:defaultError');
  messages.default = i18next.t('error:code.default');
  messages[301] = i18next.t('error:code.301');
  messages[400] = i18next.t('error:code.400');
  messages[401] = i18next.t('error:code.401');
  messages[403] = i18next.t('error:code.403');
  messages[404] = i18next.t('error:code.404');
  messages[405] = i18next.t('error:code.405');
  messages[406] = i18next.t('error:code.406');
  messages[407] = i18next.t('error:code.407');
  messages[408] = i18next.t('error:code.408');
  messages[409] = i18next.t('error:code.409');
  messages[500] = i18next.t('error:code.500');
  messages[501] = i18next.t('error:code.501');
  messages[502] = i18next.t('error:code.502');
  messages[503] = i18next.t('error:code.503');
  messages[504] = i18next.t('error:code.504');
  messages[505] = i18next.t('error:code.505');
});

/**
 * Error handler
 *
 * En la función se define el flujo de la aplicación en caso de un error.
 * Nota: Si error es Network Error, se redirecciona a NETWORK_ERROR_REDIRECT_PATH
 *
 * @param {String | Object | Error} error
 * @returns {String[2]}
 *
 * @see NETWORK_ERROR_REDIRECT_PATH
 *
 */
function handleError(error, options = { onUnauthorizedRedirect: true }) {
  let message = '';
  let redirect = null;

  if (!_.isNull(error)
      && _.isString(error)
      && !_.isEmpty(error)
  ) {
    message = error;
  }

  if (error
      && !_.isNull(error.response)
      && _.isString(error.response)
      && !_.isEmpty(error.response)
  ) {
    message = message || error.response;
  }

  if (error
      && error.response
      && !_.isNull(error.response.data)
      && _.isString(error.response.data)
      && !_.isEmpty(error.response.data)
  ) {
    message = message || error.response.data;
  }

  if (error
      && error.response
      && error.response.data
      && !_.isNull(error.response.data.message)
      && _.isString(error.response.data.message)
      && !_.isEmpty(error.response.data.message)
  ) {
    message = message || error.response.data.message;
  }

  if (error
      && !_.isNull(error.message)
  ) {
    switch (error.message) {
      case 'Network Error':
        message = messages.networkError;
        redirect = NETWORK_ERROR_REDIRECT_PATH;
        break;
      default:
        message = message || error.message;
    }
  }

  if (error
      && error.response
      && _.isNumber(error.response.status)
  ) {
    switch (error.response.status) {
      case 401:
      {
        redirect = options.onUnauthorizedRedirect && '/logout';
        break;
      }
      case 403:
      {
        redirect = null;
        break;
      }

      case 404:
      {
        redirect = null;
        break;
      }

      case 500:
      {
        redirect = null;
        break;
      }

      case 504:
      {
        redirect = NETWORK_ERROR_REDIRECT_PATH;
        break;
      }

      default: {
        break;
      }
    }

    message = message || messages[error.response.status] || messages.default;
  }

  message = message || messages.default;

  return [message, redirect];
}

export default handleError;
