import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18n } from 'react-i18next';

import 'app/styles/semantic-ui/semantic.less';
import 'app/styles/custom/main.less';

import { store, persistor, history } from 'app/store';
import AppRoutes from 'app/routes/app';

import 'app/i18n';
import { Dimmer, Loader } from 'semantic-ui-react';

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Dimmer inverted active><Loader /></Dimmer>}>
        <ConnectedRouter history={history}>
          <I18n ns="translations">
            {
              (t, { i18n }) => <Component translate={t} t={t} i18n={i18n} />
            }
          </I18n>
        </ConnectedRouter>
      </PersistGate>
    </Provider>,
    document.getElementById('app'),
  );
};

document.addEventListener('DOMContentLoaded', () => {
  render(AppRoutes);
});

if (module.hot) {
  module.hot.accept('./routes/app', () => {
    render(AppRoutes).catch((e) => console.error(e));

    render(require('app/routes/app')).catch((e) => console.error(e));
  });
}
