import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ControlChat } from 'components/ControlChat';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'slices';
import { signInconn } from 'connHub';
import axios from 'axios';
import './assets/scss/index.scss';

declare const window: any;
declare const browser: any;

window.testReactComponentUnmount = null;
window.componentEdesk = false;
window.activeWindow = true;

window.isLoadingHADS = () => {
  return $('.CN_contentconnWait').length > 0;
}
window.removeLoadingHADS = () => {
  $('.CN_contentconnWait').remove();
}

window.createLoadingHADS = () => {
  try {
    if ($('.CN_contentconnWait').length > 0) return;
    let divLoading = document.createElement('div');
    divLoading.setAttribute('class', 'CN_contentconnWait');
    $(divLoading).css({
      opacity: '0.8',
      'z-index': 7000,
      'background-size': '18%'
    });
    setTimeout(function () {
      $(divLoading).css({
        opacity: '0.8',
        'background-size': '18%'
      });
    }, 100);

    $("body").append(divLoading);
  } catch (err) {
  }
}

export const store = configureStore({ reducer: rootReducer });

window.ADS_testReactComponent = (container: any) => {
  window.adsTestReactContainerComponentUnmount =
    ReactDOM.unmountComponentAtNode;
  ReactDOM.render(
    <Provider store={store}>
      <ControlChat container={container} store={store}></ControlChat>
    </Provider>,
    document.getElementById('testReactContainer')
  );
};

window.ADS_testReactComponentUnmount = () => {
  ReactDOM.unmountComponentAtNode(
    document.getElementById('testReactContainer')
  );
};

window.ADSstore = store;

window.creaEspera = (metodo: any, data: any, container: any) => {
  window.clickActividad();
  setTimeout(() => {
    window.ADS_testReactComponent(container);
  }, 500);

  const intervalId = setInterval(() => {
    let url = 'TimerSession/TimerSession.aspx';
    axios
      .get(url)
      .then((res) => {})
      .catch((error) => console.error(error));
  }, 60000);

  window.addEventListener('blur', () => {
    window.activeWindow = false;
  });
  window.addEventListener('focus', () => {
    window.activeWindow = true;
  });

  'drop dragover'.split(' ').forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      event.preventDefault();
    });
  });
};

window.loginconn = (usr: string, con: string, tkn: string) => {
  signInconn(
    usr,
    con,
    sessionStorage.id_prod,
    sessionStorage.id_proy,
    sessionStorage.id_apl,
    tkn
  );
};
