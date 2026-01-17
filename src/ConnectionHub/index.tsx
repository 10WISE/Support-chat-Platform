import 'signalr';
import { store } from 'index';
import { setIsconned } from 'slices/connHub';
import { setLoggedUser, setTimeAns } from 'slices/app';
import * as _ from 'lodash';
import { setLoadingWait } from 'slices/app';

declare const window: any;
declare const conn_HUB_SIGNALR_URL: any;

let connion = $.hubconnion(conn_HUB_SIGNALR_URL, {
  useDefaultPath: false,
});

window.connion = connion;
let connHub = connion.createHubProxy('connHub');

connion.disconned(() => {
  store.dispatch(setIsconned(false));
});

connion.reconned(() => {});

//https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-javascript-client#establishconnion
// Es necesario definir un escucha antes de realizar la conexión conection.start();
connHub.on('initializer', () => {});

export const signInconn = (
  user: string,
  password: string,
  idProd: string,
  idProy: string,
  idApl: string,
  token: string
) => {
  connion
    .start({ transport: 'webSockets', pingInterval: 90000 })
    .done(() => {
      store.dispatch(setLoadingWait(true));
      connHub.invoke(
        'HADS_Login',
        user,
        password,
        idProd,
        idProy,
        idApl,
        token
      )
        .done((res) => {
          store.dispatch(setLoggedUser(res));
          store.dispatch(setIsconned(true));
        })
        .catch((err) => {
          console.error(err);
        });

      connHub.invoke('GetTimeAnsProject')
        .done((res) => {
          store.dispatch(setTimeAns(res.message));
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

export default connHub;
