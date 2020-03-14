import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { createCookieMiddleware } from 'redux-cookie';
import thunk from 'redux-thunk';
import Cookies from 'js-cookie';

import { persistStore, persistReducer } from 'redux-persist';
import { routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import reducers from 'app/reducers';
import DevTools from 'app/components/DevTools';

export const history = createBrowserHistory({
  basename: '/',
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['router', 'form', 'auth'],
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};

const packages = [];
const enhancers = [];

// Push middleware that you need for both development and production
packages.push(routerMiddleware(history));
packages.push(thunk);
packages.push(createCookieMiddleware(Cookies));

if (process.env.NODE_ENV === 'development') {
  // Push the middleware that are specific for development
  packages.push(createLogger());
  enhancers.push(DevTools.instrument());
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }
}

const middleware = applyMiddleware(...packages);

export const store = createStore(
  persistReducer(persistConfig, reducers(history)),
  compose(
    middleware,
    ...enhancers,
  ),
);

export const persistor = persistStore(store);

export default {
  store,
  persistor,
  history,
};
