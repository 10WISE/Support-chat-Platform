import 'signalr';
import { store } from 'index';
import { setIsConnected } from 'slices/connectHub';
import { setLoggedUser, setTimeAns } from 'slices/app';
import * as _ from 'lodash';
import { setLoadingWait } from 'slices/app';

declare const window: any;
declare const CONNECT_HUB_SIGNALR_URL: any;

let connection = $.hubConnection(CONNECT_HUB_SIGNALR_URL, {
  useDefaultPath: false,
});

window.connection = connection;
let ConnectHub = connection.createHubProxy('connectHub');

connection.disconnected(() => {
  store.dispatch(setIsConnected(false));
});

connection.reconnected(() => {});

//https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-javascript-client#establishconnection
// Es necesario definir un escucha antes de realizar la conexión conection.start();
ConnectHub.on('initializer', () => {});

export const signInConnect = (
  user: string,
  password: string,
  idProd: string,
  idProy: string,
  idApl: string,
  token: string
) => {
  connection
    .start({ transport: 'webSockets', pingInterval: 90000 })
    .done(() => {
      store.dispatch(setLoadingWait(true));
      ConnectHub.invoke(
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
          store.dispatch(setIsConnected(true));
        })
        .catch((err) => {
          console.error(err);
        });

      ConnectHub.invoke('GetTimeAnsProject')
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

export default ConnectHub;
